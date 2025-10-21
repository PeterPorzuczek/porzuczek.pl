import { useEffect } from 'react'

export function useFreshData(setData: (data: any) => void) {
  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const remoteDataUrl = `https://raw.githubusercontent.com/PeterPorzuczek/porzuczek.pl/refs/heads/main/public/portfolio-data.json?v=${new Date().getTime()}`;
        const response = await fetch(remoteDataUrl);
        if (response.ok) {
          const freshData = await response.json();
          // Update copyright year
          if (freshData?.contactInfo?.footer) {
            freshData.contactInfo.footer.copyright = `© ${new Date().getFullYear()} PIOTR PORZUCZEK`;
          }
          setData(freshData);
          console.log('Successfully fetched fresh data from GitHub.');
        } else {
          console.warn('Failed to fetch fresh data from GitHub.');
        }
      } catch (error) {
        console.warn('Error fetching fresh data from GitHub:', error);
      }
    };

    fetchFreshData();
  }, [setData])
}

