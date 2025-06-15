import { cache } from 'react'
import fs from 'fs/promises';
import path from 'path';

export const getPortfolioData = cache(async () => {
  const remoteDataUrl = 'https://raw.githubusercontent.com/PeterPorzuczek/porzuczek.pl/refs/heads/main/public/portfolio-data.json';

  let data;

  try {
    // Using Incremental Static Regeneration (ISR).
    // This will build a static page, then re-fetch data in the background
    // at most once every 60 seconds.
    const res = await fetch(remoteDataUrl, { next: { revalidate: 60 } }); 
    if (!res.ok) {
      // This will be caught by the catch block and trigger the fallback.
      throw new Error(`Failed to fetch from remote: ${res.statusText} (status: ${res.status})`);
    }
    data = await res.json();
    console.log('Successfully fetched data from remote URL (ISR).');
  } catch (error) {
    console.warn(`Could not fetch remote data. Falling back to local file. Error: ${error.message}`);
    
    // Fallback to the local file system.
    // This works at build time and at runtime on the server.
    try {
      const localDataPath = path.join(process.cwd(), 'public', 'portfolio-data.json');
      const localData = await fs.readFile(localDataPath, 'utf-8');
      data = JSON.parse(localData);
      console.log('Successfully loaded data from local fallback file.');
    } catch (fallbackError) {
      console.error('Failed to read local fallback data.', fallbackError);
      // If both remote and local fail, we must throw an error.
      throw new Error('Failed to fetch portfolio data from both remote and local sources.');
    }
  }

  // Dynamically update the copyright year
  if (data?.contactInfo?.footer) {
    data.contactInfo.footer.copyright = `© ${new Date().getFullYear()} PIOTR PORZUCZEK`;
  }

  return data;
});
