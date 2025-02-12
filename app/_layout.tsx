import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "@/global.css";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SQLiteProvider } from "expo-sqlite";
import { DATABASE_NAME } from "@/database/config-db";
import { initializeDB } from "@/database/db";

// import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
// const toastConfig = {
//   success: (props) => (
//     <BaseToast
//       {...props}
//       style={{ borderLeftColor: 'pink', backgroundColor: 'pink' }}
//       contentContainerStyle={{ paddingHorizontal: 15 }}
//       text1Style={{
//         fontSize: 15,
//         fontWeight: '400'
//       }}
//     />
//   ),
//   info: (props) => (
//     <BaseToast
//       {...props}
//       style={{ borderLeftColor: 'pink', backgroundColor: 'pink' }}
//       contentContainerStyle={{ paddingHorizontal: 15 }}
//       text1Style={{
//         fontSize: 15,
//         fontWeight: '400'
//       }}
//     />
//   ),
//   error: (props) => (
//     <ErrorToast
//       {...props}
//       text1Style={{
//         fontSize: 17
//       }}
//       text2Style={{
//         fontSize: 15
//       }}
//     />
//   ),
// };
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [colorMode] = useState<"light" | "dark">("dark");

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar
        style="auto"
        backgroundColor={`${colorMode == "light" ? "#272625" : "#2a2438"}`}
      />
      <GluestackUIProvider mode={colorMode}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            onInit={initializeDB}
          >
            <Stack>
              <Stack.Screen
                name="index"
                options={{ headerShown: false, title: "Finance App" }}
              />
            </Stack>
            {/* <Toast config={toastConfig} /> */}
          </SQLiteProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </>
  );
}
