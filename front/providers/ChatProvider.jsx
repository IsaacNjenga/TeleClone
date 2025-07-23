import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

const ChatProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile) {
      return;
    } else console.log("User connected!");

    const imageUrl = supabase.storage
      .from("avatars")
      .getPublicUrl(profile.avatar_url).data.publicUrl;

    const connect = async () => {
      await client.connectUser(
        {
          id: profile.id,
          name: profile.full_name,
          image: imageUrl,
        },
        client.devToken(profile.id)
      );
    };
    setIsReady(true);
    connect();

    return () => {
      if (isReady) {
        client.disconnectUser();
      }
      setIsReady(false);
    };
  }, [profile?.id]);

  if (!isReady)
    return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              color: "#333",
            }}
          >
            Loading...
          </Text>
        </View>
    );

  return (
    <>
      <OverlayProvider>
        <Chat client={client}>{children}</Chat>
      </OverlayProvider>
    </>
  );
};

export default ChatProvider;
