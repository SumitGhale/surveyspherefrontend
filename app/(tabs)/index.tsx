import FilledButton from "@/components/ui/filled_button";
import GreyTextField from "@/components/ui/grey_text_field";
import PartiallyFilledButtons from "@/components/ui/partially_filled_buttons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import Card from "../../components/ui/white-container";
import "../../global.css";
import SurveyCard from "@/components/survey-card";
import { use, useEffect, useState } from "react";
import { getAllSurveys, createSurvey } from "@/services/survey_services";
import { useSurveys } from "@/contexts/surveyContext";
import LoadingSpinner from "@/components/ui/loading_spinner";
import { Survey } from "@/models/survey";

export default function HomeScreen() {
  const { surveys, setSurveys } = useSurveys();
  const [projectTitle, setProjectTitle] = useState("");
  const [modalVisible, setmodalVisible] = useState(false);
  useEffect(() => {
    const fetchSurveys = async () => {
      const surveyList = await getAllSurveys();
      if (surveyList) {
        setSurveys(surveyList);
      }
    };
    fetchSurveys();
  }, []);

  const navigateToQuestions = (surveyId: string) => {
    router.push({
      pathname: "./edit_survey",
      params: { surveyId },
    });
  };

  const createNewSurvey = async (surveyTitle: string) => {
    //  create a survey in database
    const newSurvey: Survey = {
      host_id: "a95db083-e90d-432d-be54-81cf964d1d6d",
      title: surveyTitle,
      code: "XYZ123",
      status: "draft",
    };

    //  create the survey in the database
    const createdSurvey = await createSurvey(newSurvey);
    if (createdSurvey && createdSurvey.id) {
      console.log("Created survey with ID:", createdSurvey.id);
    }
    setmodalVisible(false);
    //  get the id and navigate to edit_survey page
  };
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
        <PartiallyFilledButtons onPress={() => setmodalVisible(true)} />
      </Card>

      {/* projects section */}

      <Text className="text-2xl font-semibold text-gray-800 mb-4 mt-6">
        Your Surveys
      </Text>
      <View className=" flex flex-row flex-wrap justify-between ">
        {surveys.length === 0 ? (
          <View className="w-full items-center justify-center py-10">
            <LoadingSpinner />
          </View>
        ) : (
          surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              status={survey.status}
              title={survey.title}
              questions="12"
              onPress={() => {
                survey.id ? navigateToQuestions(survey.id) : null;
              }}
            />
          ))
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Handle modal close if needed
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white border-b border-gray-300 rounded-lg w-[90%] max-w-md">
            <View className="border-b mb-6 border-gray-300">
              <Text className="m-5 text-xl font-semibold">
                Create New Project
              </Text>
            </View>
            <View className="px-5">
              <Text className="text-lg mb-4">Project Title</Text>
              <TextInput
                className="bg-gray-100 border border-gray-200 mb-4 rounded-xl p-4 text-gray-800"
                placeholder="Enter project title..."
                placeholderTextColor="#9ca3af" // Tailwind gray-400
                value={projectTitle}
                onChangeText={setProjectTitle}
              />
              <Text className="text-sm mb-6 text-gray-500">
                {" "}
                Give your project a descriptive name.
              </Text>

              <View className="mb-6 flex-row justify-between">
                <Pressable
                  onPress={() => setmodalVisible(false)}
                  className="p-4 w-[120px] rounded-lg bg-background-gray "
                >
                  <Text className="text-center">Cancel</Text>
                </Pressable>
                <Pressable onPress={() => createNewSurvey(projectTitle)} className="p-4 w-[120px] rounded-lg bg-primary-blue ">
                  <Text className="text-white text-center">Create</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
