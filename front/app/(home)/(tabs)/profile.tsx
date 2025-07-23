import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { useAuth } from "@/providers/AuthProvider";
import Avatar from "@/components/avatar";
import { client } from "@/providers/ChatProvider";

export default function ProfileScreen() {
  const { session } = useAuth();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, website, avatar_url, full_name")
        .eq("id", session.user.id)
        .single();

      // If profile doesn't exist (status 406 or no data), create one
      if ((error && status === 406) || !data) {
        const insertResult = await supabase.from("profiles").insert([
          {
            id: session.user.id,
            email: session.user.email, // optional, if you have that column
            username: "",
            website: "",
            avatar_url: "",
            full_name: "",
          },
        ]);

        if (insertResult.error) {
          throw insertResult.error;
        }

        // Optionally, you can re-call getProfile() here or just set state directly
        setUsername("");
        setWebsite("");
        setAvatarUrl("");
        setFullname("");
        return;
      }

      // Existing profile found
      setUsername(data.username || "");
      setWebsite(data.website || "");
      setAvatarUrl(data.avatar_url || "");
      setFullname(data.full_name || "");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Profile error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
  }: {
    username: string;
    website: string;
    avatar_url: string;
    full_name: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        email: session?.user.email,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      };

      console.log(updates);

      const { data, error } = await supabase.from("profiles").upsert(updates);
      console.log("UPSERT response:", { data, error });

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    try {
      await client.disconnectUser();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
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
    </View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Avatar
            size={150}
            url={avatarUrl}
            onUpload={(url: string) => {
              setAvatarUrl(url);
              // updateProfile({
              //   username,
              //   website,
              //   avatar_url: url,
              //   full_name: fullname,
              // });
            }}
          />
        </View>
        {/* ... */}

        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Full Name"
          value={fullname || ""}
          onChangeText={(text) => setFullname(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Website"
          value={website || ""}
          onChangeText={(text) => setWebsite(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile({
              username,
              website,
              avatar_url: avatarUrl,
              full_name: fullname,
            })
          }
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 12,
    marginBottom: 10,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 0,
  },
});
