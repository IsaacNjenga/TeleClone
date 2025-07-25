import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import ChatProvider from "@/providers/ChatProvider";
import { useAuth } from "@/providers/AuthProvider";

const HomeLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ChatProvider>
  );
};

export default HomeLayout;
