import AuthProvider from "@/providers/AuthProvider";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

//define global providers
export default function RootLayout() {
  useEffect(() => {
    const run = async () => {
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          "android.permission.POST_NOTIFICATIONS",
          "android.permission.BLUETOOTH_CONNECT",
        ]);
      }
    };
    run();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
