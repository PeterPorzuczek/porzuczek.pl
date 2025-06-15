import { cache } from 'react'

export const getPortfolioData = cache(async () => {
  // The user wants to use a raw GitHub URL in the future.
  // For now, we'll fetch from the local public directory.
  // When deploying, this URL should be absolute.
  const dataUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || '/portfolio-data.json';
  
  // Using fetch to simulate loading from a remote endpoint.
  // In a real app with a local JSON, you might use fs.readFile in a server environment.
  // But to prepare for a remote URL, fetch is appropriate.
  // We need an absolute URL for fetch on the server-side.
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}${dataUrl}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch portfolio data from ${dataUrl}`);
  }

  const data = await res.json();

  // Dynamically update the copyright year
  data.contactInfo.footer.copyright = `© ${new Date().getFullYear()} PIOTR PORZUCZEK`;

  return data;
});
