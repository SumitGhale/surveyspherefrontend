import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  TextInput,
  Pressable,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/userContext";
import { LinearGradient } from "expo-linear-gradient";
import PollyLogo from "@/components/icons/poly-logo";

export default function LoginPage() {
  const [email, setEmail] = useState("tam@mailinator.com");
  const [password, setPassword] = useState("Tam1234");
  const [session, setSession] = useState<Session | undefined | null>();
  const { setUser } = useAuth();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      }

      setSession(session);

      if (session?.user) {
        // Set user in context
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.displayName || "John Doe",
        });
        router.replace("/(tabs)");
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      setSession(session);

      if (_event === "SIGNED_IN" && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.displayName || "John Doe",
        });
      } else if (_event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else if (data.user) {
      // Set user in context on successful login
      setUser({
        id: data.user.id,
        email: data.user.email,
      });
      router.replace("/(tabs)");
    }
  }

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F0FDF4", "#D1FAE5", "#10B981"]}
      locations={[0, 0.4, 0.8, 1]}
      style={styles.container}
    >
      <View style={styles.main}>
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <PollyLogo size={100} />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />

          <Pressable style={styles.loginButton} onPress={signInWithEmail}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          <Pressable style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  signupButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#059669",
  },
  signupButtonText: {
    color: "#059669",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
