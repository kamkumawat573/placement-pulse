import { useState, useEffect } from 'react';

export function useLogo() {
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/settings/logo_url');
        if (response.ok) {
          const data = await response.json();
          setLogo(data.setting?.value || '/placement-pulse-logo.png');
        } else {
          // Fallback to default logo if setting doesn't exist
          setLogo('/placement-pulse-logo.png');
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        // Fallback to default logo on error
        setLogo('/placement-pulse-logo.png');
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  return { logo, loading };
}
