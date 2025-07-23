import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase";

export const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

const ChatProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const { profile } = useAuth();

  const authoriseToken = async (user_id) => {
    const res = await fetch(
      "https://tele-clone-six.vercel.app/api/authorise-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      }
    );

    const data = await res.json();
    return data.token;
  };

  useEffect(() => {
    if (!profile) {
      return;
    } else console.log("User connected!");

    const imageUrl = supabase.storage
      .from("avatars")
      .getPublicUrl(profile.avatar_url).data.publicUrl;

    const connect = async () => {
      const token = await authoriseToken(profile.id);
      console.log(token);
      await client.connectUser(
        {
          id: profile.id,
          name: profile.full_name,
          image: imageUrl,
        },
        token
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
