import { useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { ThemeContext } from '@/components/ui/ThemeProvider/ThemeProvider';

/**
 * App-wide color scheme hook.
 *
 * Source of truth:
 * - If the user selected a theme in-app (ThemeProvider), return that.
 * - Otherwise, fall back to the system color scheme.
 */
export function useColorScheme(): 'light' | 'dark' {
	const systemScheme = useRNColorScheme();
	const theme = useContext(ThemeContext);

	if (theme?.resolvedTheme) return theme.resolvedTheme;
	return systemScheme === 'dark' ? 'dark' : 'light';
}
