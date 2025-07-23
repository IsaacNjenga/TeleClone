import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import UserListItem from "@/components/UserListItem";

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.id) return;
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id); //exclude me
      if (error) {
        console.error("Fetch error:", error);
      }

      setUsers(data || []);
    };
    fetchUsers();
  }, [user]);
  return (
    <FlatList
      data={users}
      contentContainerStyle={{ gap: 5 }}
      renderItem={({ item }) => <UserListItem item={item} />}
    />
  );
};

export default UsersScreen;
