import FilledButton from "@/components/ui/filled_button";
import GreyTextField from "@/components/ui/grey_text_field";
import PartiallyFilledButtons from "@/components/ui/partially_filled_buttons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/ui/white-container";
import "../../global.css";
import SurveyCard from "@/components/survey-card";

const surveys = [
  {
    id: "1",
    status: "Completed",
    title: "Importance of AI",
    questions: "5 Questions",
  },
  {
    id: "2",
    status: "Draft",
    title: "Customer Satisfaction Survey",
    questions: "8 Questions",
  },
  {
    id: "3",
    status: "Draft",
    title: "Employee Feedback 2024",
    questions: "12 Questions",
  },
  {
    id: "4",
    status: "Completed",
    title: "Product Launch Poll",
    questions: "6 Questions",
  },
  {
    id: "5",
    status: "Draft",
    title: "Website User Experience",
    questions: "10 Questions",
  },
  {
    id: "6",
    status: "Draft",
    title: "Annual Team Review",
    questions: "15 Questions",
  },
];

export default function HomeScreen() {
  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 16, backgroundColor: "#F5F5F5" }}
    >
      <View
        className="flex-row items-center justify-center my-6"
        style={styles.titleContainer}
      >
        <MaterialCommunityIcons
          name="ballot-outline"
          size={30}
          color="#15A4EC"
        />
        <Text className="font-bold text-xl my-4 ">SurveySphere</Text>
      </View>

      {/* join survey card */}
      <Card>
        <Text className="text-2xl font-semibold text-gray-800 mb-2">
          Join a survey
        </Text>
        <View className="flex-row items-center justify-between gap-4">
          <GreyTextField
            value=""
            onChangeText={() => {}}
            placeholder="Enter your survey code"
          />
          <FilledButton />
        </View>
      </Card>

      {/* create survey card */}
      <Card>
        <Text className="text-2xl font-semibold text-gray-800">
          Create a new survey
        </Text>
        <Text className="text-sm text-gray-500 my-4 tracking-wide">
          Engage your audience with real-time {"\n"}feedback
        </Text>
        <PartiallyFilledButtons onPress={() => router.push("./edit_survey")} />
      </Card>

      {/* projects section */}

      <Text className="text-2xl font-semibold text-gray-800 mb-4 mt-6">
        Your Surveys
      </Text>
      <View className="flex flex-row flex-wrap justify-between ">
        {surveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            status={survey.status}
            title={survey.title}
            questions={survey.questions}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
