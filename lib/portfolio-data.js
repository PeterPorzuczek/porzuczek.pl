import { cache } from 'react'
import fs from 'fs/promises';
import path from 'path';

export const getPortfolioData = cache(async () => {
  const remoteDataUrl = 'https://raw.githubusercontent.com/PeterPorzuczek/porzuczek.pl/refs/heads/main/public/portfolio-data.json';

  let data;

  try {
    // First, try to fetch data from the remote source.
    const res = await fetch(remoteDataUrl, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!res.ok) {
      throw new Error(`Failed to fetch from remote: ${res.statusText}`);
    }
    data = await res.json();
    console.log('Successfully fetched data from remote URL.');
  } catch (error) {
    console.warn(`Could not fetch remote data. Falling back to local file. Error: ${error.message}`);
    
    // If remote fetch fails, fall back to the local file system.
    // This is robust for the build process (`next build`).
    try {
      const localDataPath = path.join(process.cwd(), 'public', 'portfolio-data.json');
      const localData = await fs.readFile(localDataPath, 'utf-8');
      data = JSON.parse(localData);
      console.log('Successfully loaded data from local fallback file.');
    } catch (fallbackError) {
      console.error('Failed to read local fallback data.', fallbackError);
      throw new Error('Failed to fetch portfolio data from both remote and local sources.');
    }
  }

  // Dynamically update the copyright year
  if (data?.contactInfo?.footer) {
    data.contactInfo.footer.copyright = `© ${new Date().getFullYear()} PIOTR PORZUCZEK`;
  }

  return data;
});
