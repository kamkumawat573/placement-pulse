import { useState, useEffect } from 'react';

// Global cache for logo to prevent repeated API calls
let logoCache: string | null = null;
let logoLoadingCache = false;
let logoInitialized = false;

// Check localStorage first
const getCachedLogo = () => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('placement-pulse-logo');
    } catch {
      return null;
    }
  }
  return null;
};

// Cache logo in localStorage
const setCachedLogo = (logoUrl: string) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('placement-pulse-logo', logoUrl);
    } catch {
      // Ignore localStorage errors
    }
  }
};

export function useLogo() {
  const [logo, setLogo] = useState<string | null>(() => {
    // Check global cache first
    if (logoCache !== null) {
      return logoCache;
    }
    // Then check localStorage
    const cached = getCachedLogo();
    if (cached) {
      logoCache = cached;
      return cached;
    }
    return null;
  });
  const [loading, setLoading] = useState(logoLoadingCache);

  useEffect(() => {
    // If we already have cached logo, use it immediately
    if (logoCache !== null) {
      setLogo(logoCache);
      setLoading(false);
      return;
    }

    // Check localStorage
    const cached = getCachedLogo();
    if (cached) {
      setLogo(cached);
      logoCache = cached;
      setLoading(false);
      return;
    }

    // If logo is already being fetched, don't fetch again
    if (logoInitialized) {
      return;
    }

    logoInitialized = true;
    setLoading(true);

    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/settings/logo_url', {
          cache: 'force-cache',
          headers: {
            'Cache-Control': 'max-age=3600'
          }
        });
        
        let logoUrl = '/placement-pulse-logo.png'; // Default fallback
        
        if (response.ok) {
          const data = await response.json();
          logoUrl = data.setting?.value || '/placement-pulse-logo.png';
        }
        
        // Update state and caches
        setLogo(logoUrl);
        logoCache = logoUrl;
        setCachedLogo(logoUrl);
        
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        // Use fallback logo
        const fallbackLogo = '/placement-pulse-logo.png';
        setLogo(fallbackLogo);
        logoCache = fallbackLogo;
        setCachedLogo(fallbackLogo);
      } finally {
        setLoading(false);
        logoLoadingCache = false;
      }
    };

    fetchLogo();
  }, []);

  return { logo, loading };
}
