import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import PollyLogo from "@/components/icons/poly-logo";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        headerStatusBarHeight: 0, // remove gap
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Poly",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <PollyLogo size={40} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
