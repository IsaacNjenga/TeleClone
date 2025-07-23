import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useChatContext } from "stream-chat-expo";
import { router } from "expo-router";

const UserListItem = ({ item }) => {
  const { user: me } = useAuth();
  const { client } = useChatContext();

  const onPress = async () => {
    const members = [me.id, item.id].sort();

    const channel = client.channel("messaging", {
      members,
    });

    await channel.watch();
    router.replace(`/(home)/channel/${channel.cid}`);
  };

  return (
    <Pressable
      onPress={onPress}
      style={{ padding: 15, backgroundColor: "white" }}
    >
      <View
        style={{
          flex: 1,
          gap: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "left",
        }}
      >
        <Image
          source={{
            uri: "https://pbs.twimg.com/media/Gwa6tiIW4AMXNx5?format=jpg&name=900x900",
          }}
          accessibilityLabel="Avatar"
          style={[
            styles.avatarSize,
            styles.avatar,
            styles.image,
            styles.noImage,
          ]}
        />
        <Text style={{ fontWeight: 600, fontSize: 17 }}>{item.full_name}</Text>
      </View>
    </Pressable>
  );
};

export default UserListItem;

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
    overflow: "hidden",
    maxWidth: "100%",
    padding: 10,
  },
  image: {
    objectFit: "cover",
    borderWidth: 5,
    borderStyle: "solid",
    borderColor: "rgba(47, 44, 44, 1)",
    padding: 10,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(47, 44, 44, 1)",
  },
  avatarSize: { height: 50, width: 50 },
});
