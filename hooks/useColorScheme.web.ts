import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useContext } from 'react';

import { ThemeContext } from '@/components/ui/ThemeProvider/ThemeProvider';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const theme = useContext(ThemeContext);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const systemScheme = useRNColorScheme();
  const resolved = theme?.resolvedTheme ?? (systemScheme === 'dark' ? 'dark' : 'light');

  if (hasHydrated) {
    return resolved;
  }

  return 'light';
}
