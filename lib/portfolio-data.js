import fs from 'fs/promises';
import path from 'path';

// This function only loads local data for static generation (index.html).
// The client component will handle fetching from GitHub after page load.
export const getPortfolioData = async () => {
  try {
    const localDataPath = path.join(process.cwd(), 'public', 'portfolio-data.json');
    const localData = await fs.readFile(localDataPath, 'utf-8');
    const data = JSON.parse(localData);
    
    // Dynamically update the copyright year
    if (data?.contactInfo?.footer) {
      data.contactInfo.footer.copyright = `© ${new Date().getFullYear()} PIOTR PORZUCZEK`;
    }
    
    console.log('Successfully loaded data from local file for static generation.');
    return data;
  } catch (error) {
    console.error('Failed to read local data for static generation.', error);
    throw new Error('Failed to load portfolio data for static generation.');
  }
};
