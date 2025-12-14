import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import QuestionProvider from "@/contexts/questionContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import SurveyProvider from "@/contexts/surveyContext";
import { UserProvider } from "@/contexts/userContext";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView className="flex-1">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <QuestionProvider>
          <SurveyProvider>
            <UserProvider>
            <Stack>
              <Stack.Screen
                name="index"
                options={{ title: "Login", headerTitleAlign: "center" ,
                headerShown: false
                }}
              />
              <Stack.Screen
                name = "signup"
                options={{ title: "Sign Up", headerTitleAlign: "center", headerShown: false }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="edit_survey"
                options={{ title: "Edit Survey", headerTitleAlign: "center" }}
              />
              <Stack.Screen
                name="add_new_qsn"
                options={{
                  title: "Add New Question",
                  headerTitleAlign: "center",
                }}
              />
              <Stack.Screen
                name="survey_participant_view"
                options={{
                  title: "Survey",
                  headerTitleAlign: "center",
                }}
              />
              <Stack.Screen
              name="survey_host_view"
              options={{
                title: "Survey Host",
                headerTitleAlign: "center",
              }}
              />
              <Stack.Screen
                name="question-builder"
                options={{
                  title: "Question Builder",
                  headerTitleAlign: "center",
                }}
              />
              <Stack.Screen
                name="profile"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
            <StatusBar style="auto" />
            </UserProvider>
          </SurveyProvider>
        </QuestionProvider>
      </ThemeProvider>
    </SafeAreaView>
  );
}
