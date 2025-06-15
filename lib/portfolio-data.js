import fs from 'fs/promises';
import path from 'path';

export const getPortfolioData = async () => {
  // We add a dynamic cache-busting parameter to ensure the CDN delivers a fresh version.
  const remoteDataUrl = `https://raw.githubusercontent.com/PeterPorzuczek/porzuczek.pl/refs/heads/main/public/portfolio-data.json?v=${new Date().getTime()}`;

  let data;

  try {
    // We force the page to be dynamically rendered by opting out of the cache.
    // This ensures getPortfolioData() runs on every request.
    const res = await fetch(remoteDataUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch from remote: ${res.statusText} (status: ${res.status})`);
    }
    data = await res.json();
    console.log('Successfully fetched dynamic data from jsDelivr.');
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
