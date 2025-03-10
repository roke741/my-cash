import { ThemeProvider } from "@/components/ui/ThemeProvider/ThemeProvider";
import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "@/global.css";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SQLiteProvider } from "expo-sqlite";
import { DATABASE_NAME } from "@/database/config-db";
import { initializeDB } from "@/database/db";
import { Box } from "@/components/ui/box";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Toaster } from "sonner-native";
import { Portal } from "@/components/ui/portal";
import { View } from "react-native";

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
  const colorScheme = useColorScheme() || "dark";
  const [colorMode, setColorMode] = useState<"light" | "dark" | "system">(
    colorScheme
  );

  //const [colorMode] = useState<"light" | "dark">("dark");
  //const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/Cabin-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (error) {
        console.error("Error loading fonts:", error);
      }
    }
  }, [loaded, error]);

  useEffect(() => {
    setColorMode(colorScheme);
    console.log("colorScheme", colorScheme);
  }, [colorScheme]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDB}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GluestackUIProvider mode={colorMode}>
            <ThemeProvider>
              <StatusBar
                style={colorMode === "dark" ? "light" : "dark"}
                backgroundColor={colorMode === "dark" ? "#352F44" : "#DBD8E3"}
              />
              <SafeAreaView style={{ flex: 1 }}>
                <View className={`bg-background-${colorMode} p-4 h-full`}>
                  <Slot />
                </View>
              </SafeAreaView>
            </ThemeProvider>
          </GluestackUIProvider>
          <Toaster visibleToasts={2} richColors/>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
