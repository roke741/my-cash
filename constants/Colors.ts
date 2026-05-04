/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#7C3AED';
const tintColorDark = '#8B5CF6';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F5EAF8',
    background: '#1C141E',
    tint: tintColorDark,
    icon: '#CFC1D6',
    tabIconDefault: '#CFC1D6',
    tabIconSelected: tintColorDark,
  },
};
