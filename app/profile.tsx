import { ScrollView, View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UserIcon from "@/components/icons/user-icon";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useAuth } from "@/contexts/userContext";

export default function ProfileScreen() {
  const {user} = useAuth()
  const onLogout = async () => {
    // Handle logout logic here
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }else{
        router.replace("/");
    }
  };

  return (
    <View className="flex-1 bg-background-gray">
      <View className={"items-center flex-1"}>
        {/* Gradient Header */}
        <LinearGradient
          colors={["#10B981", "#14B8A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full justify-center h-96 items-center"
        >
          <View className="my-8 items-center ju">
            <UserIcon size={100} color="white" />
            <Text className="text-white text-center text-2xl mt-4">
              {user?.name || "User Name"}
            </Text>
            <Text className="text-gray-100 text-center text-medium mt-2">
              {user?.email || "user@example.com"}
            </Text>
            <View className="flex-row mt-4">
              <View className="border-r-2 border-white w-1/2">
                <Text className="text-white text-center text-lg">12</Text>
                <Text className="text-gray-100 text-center text-medium mt-1">
                  Surveys
                </Text>
              </View>
              <View className="w-1/2">
                <Text className="text-gray-100 text-center text-medium mt-1">
                  Member since
                </Text>
                <Text className="text-white text-center text-lg">Jan 2023</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      <Pressable
        onPress={onLogout}
        className="mt-auto mb-6 mx-6 p-4 rounded-lg bg-red-600 active:bg-red-700"
      >
        <Text className="text-center text-white font-semibold">Logout</Text>
      </Pressable>
    </View>
  );
}
