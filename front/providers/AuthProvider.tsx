import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Redirect, useRouter } from "expo-router";
import { Alert } from "react-native";

type AuthContext = { session: Session | null; user: User | null; profile: any };

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // useEffect(() => {
  //   if (!session?.user) {
  //     setProfile(null);
  //     return;
  //   }

  //   const fetchProfile = async () => {
  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", session.user.id)
  //       .single();

  //     // if (error || !data) {
  //     //   // console.warn("Profile not found, redirecting...");

  //     //   // router.replace("/(home)/(tabs)/profile"); // 👈 your profile setup route

  //     //   await supabase.auth.signOut();
  //     //   setSession(null);
  //     //   setProfile(null);

  //     //   return;
  //     // }

  //     setProfile(data);
  //   };

  //   fetchProfile();
  // }, [session?.user]);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(data);

      if (data === null) {
        console.log("no data");
        Alert.alert(
          "Profile Incomplete",
          "Your profile has not been set up. Please complete your profile to continue.",
          [
            {
              text: "Go to Profile",
              onPress: () => {
                router.replace("/(home)/(tabs)/profile");
              },
            },
            {
              text: "Sign Out",
              style: "cancel",
              onPress: async () => {
                await supabase.auth.signOut();
                setSession(null);
                setProfile(null);
              },
            },
          ],
          { cancelable: false }
        );
      }
    };
    fetchProfile();
  }, [session?.user]);

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
