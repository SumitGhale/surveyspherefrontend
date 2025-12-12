import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { User } from "@/models/user";
import { createUser } from "@/services/user_service";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const createNewUser = async (user: User) => {
    try {
      const newUser = await createUser(user);
      console.log("New user created:", newUser);
      return newUser;
    } catch (error) {
      console.error("Error creating new user:", error);
    }
  };

  async function signUpWithEmail() {
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          displayName: name,
        },
      },
    });
    if (error) console.error(error);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");

    if (user) {
      await createNewUser({
        id: user.id, // ✅ Pass the auth user ID
        email: email,
        name: name,
      });
    }
    router.replace("/(tabs)");
  }

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-background-gray">
      <View className="flex-1 justify-center px-6 max-w-md w-full self-center">
        <Text className="text-4xl font-bold mb-2 text-center">
          Create Account
        </Text>
        <Text className="text-base text-gray-600 mb-8 text-center">
          Sign up to get started
        </Text>

        <View className="gap-4">
          <TextInput
            className="bg-white px-4 py-3 rounded-lg text-base border border-gray-300"
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
          />

          <TextInput
            className="bg-white px-4 py-3 rounded-lg text-base border border-gray-300"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            className="bg-white px-4 py-3 rounded-lg text-base border border-gray-300"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            className="bg-white px-4 py-3 rounded-lg text-base border border-gray-300"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoComplete="password"
          />

          <TextInput
            className="bg-white px-4 py-3 rounded-lg text-base border border-gray-300"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
          />

          <Pressable
            className="bg-primary-blue active:bg-active-blue py-3.5 rounded-lg mt-2"
            onPress={signUpWithEmail}
          >
            <Text className="text-white text-base font-semibold text-center">
              Sign Up
            </Text>
          </Pressable>

          <Pressable
            className="bg-transparent py-3.5 rounded-lg border border-primary-blue"
            onPress={handleBackToLogin}
          >
            <Text className="text-primary-blue text-base font-semibold text-center">
              Back to Login
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
