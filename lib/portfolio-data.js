import fs from 'fs/promises';
import path from 'path';

// This is the definitive implementation for fetching data with ISR.
// It does not use React.cache because Next.js's fetch handles this automatically.
export const getPortfolioData = async () => {
  // Using jsDelivr CDN for reliable caching behavior. This is the key fix.
  const remoteDataUrl = `https://cdn.jsdelivr.net/gh/PeterPorzuczek/porzuczek.pl@main/public/portfolio-data.json?v=${new Date().getTime()}`;

  let data;

  try {
    // Using Incremental Static Regeneration (ISR).
    // This builds a static page and re-fetches data in the background
    // at most once every 60 seconds after deployment.
    const res = await fetch(remoteDataUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch from remote: ${res.statusText} (status: ${res.status})`);
    }
    data = await res.json();
    console.log('Successfully fetched data from jsDelivr (ISR).');
  } catch (error) {
    console.warn(`Could not fetch remote data. Falling back to local file. Error: ${error.message}`);
    // Fallback to the local file system.
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
};
