import { getPortfolioData } from "@/lib/portfolio-data";
import PortfolioClient from "@/components/portfolio-client";

export default async function PortfolioPage() {
  const portfolioData = await getPortfolioData();

  return <PortfolioClient data={portfolioData} />;
}
