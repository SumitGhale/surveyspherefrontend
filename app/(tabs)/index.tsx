import FilledButton from "@/components/ui/filled_button";
import GreyTextField from "@/components/ui/grey_text_field";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import Card from "../../components/ui/white-container";
import "../../global.css";
import SurveyCard from "@/components/survey-card";
import { useEffect, useState } from "react";
import { getAllSurveys, createSurvey } from "@/services/survey_services";
import { useSurveys } from "@/contexts/surveyContext";
import { Survey } from "@/models/survey";
import { io } from "socket.io-client";
import JoinIcon from "@/components/icons/join-icon";
import CreateIcon from "@/components/icons/create-icon";
import PollyLogo from "@/components/icons/poly-logo";
import UserIcon from "@/components/icons/user-icon";
import { useAuth } from "@/contexts/userContext";

export default function HomeScreen() {
  const { surveys, setSurveys } = useSurveys();
  const [projectTitle, setProjectTitle] = useState("");
  const [modalVisible, setmodalVisible] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const { user } = useAuth();
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true); // ✅ Set loading before fetch
      const surveyList = await getAllSurveys(user?.id || "");
      if (surveyList) {
        setSurveys(surveyList);
      }
      setLoading(false); // ✅ Stop loading after fetch
    };

    if (user?.id) {
      fetchSurveys();
    } else {
      setLoading(false);
    }

    const socket = io(BASE_URL);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err?.message);
    });

    const handleIncoming = (payload: any) => {
      const raw = Array.isArray(payload) ? payload[0] : payload;
      if (!raw) return;

      const newSurvey: Survey = {
        id: raw.id,
        host_id: raw.host_id,
        title: raw.title ?? "",
        code: raw.code ?? "",
        status: raw.status ?? "draft",
        time_created: raw.time_created ?? "",
      };

      setSurveys((prev) => [...prev, newSurvey]);

      return () => {
        socket.off("surveyCreated", handleIncoming);
        socket.disconnect();
      };
    };
    socket.on("surveyCreated", handleIncoming);
  }, [user?.id]);

  const joinSurvey = () => {
    // emit join survey event
    const socket = io(BASE_URL);
    router.push({ pathname: "./survey_participant_view", params: { code } });
  };

  const navigateToQuestions = (surveyId: string) => {
    router.push({
      pathname: "./edit_survey",
      params: { surveyId },
    });
  };

  const createNewSurvey = async (surveyTitle: string) => {
    //  create a survey in database
    const newSurvey: Survey = {
      host_id: user?.id || "",
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
      style={{ flex: 1, paddingHorizontal: 16 }}
      className="bg-background-gray"
    >
      <View
        className="flex-row items-center mt-2 justify-between"
        style={styles.titleContainer}
      >
        <View className="flex-row items-center gap-2">
          <PollyLogo size={40} />
          <Text className="font-bold text-xl my-4 ">Poly</Text>
        </View>
        <Pressable
          onPress={() => router.push("/profile")}
          style={{ marginRight: 16 }}
        >
          <UserIcon size={35} />
        </Pressable>
      </View>

      {/* join survey card */}
      <Card>
        <View className="flex-row">
          <JoinIcon size={30} color="#059669" />
          <Text className="text-2xl font-semibold text-gray-800 mx-2 mb-2">
            Join a survey
          </Text>
        </View>

        <View className="flex-row items-center justify-between gap-4">
          <GreyTextField
            value={code}
            onChangeText={setCode}
            placeholder="Enter your survey code"
          />
          <FilledButton label="Join" onPress={() => joinSurvey()} />
        </View>
      </Card>

      {/* create survey card */}
      <Card classname="">
        <View className="flex-row items-center gap-2 mb-2">
          <CreateIcon size={30} color="#059669" />
          <Text className="text-2xl font-semibold text-gray-800">
            Create a new survey
          </Text>
        </View>

        <Text className="text-sm text-gray-500 my-4 tracking-wide">
          Engage your audience with real-time {"\n"}feedback
        </Text>
        <FilledButton label=" + Create" onPress={() => setmodalVisible(true)} />
      </Card>

      {/* projects section */}

      <Text className="text-2xl font-semibold text-gray-800 mb-4 mt-6">
        Your Surveys
      </Text>
      <View className="flex flex-row flex-wrap justify-between">
        {loading ? ( // ✅ Check loading instead of surveys === null
          <View className="w-full items-center justify-center py-10">
            <ActivityIndicator size="large" color="#059669" />
          </View>
        ) : surveys.length === 0 ? ( // ✅ Show empty state
          <View className="w-full items-center justify-center py-10">
            <Text className="text-gray-500">No surveys yet</Text>
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
        <KeyboardAvoidingView className="flex-1 items-center justify-center bg-black/50">
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
                  className="p-4 w-[120px] rounded-lg bg-card-background "
                >
                  <Text className="text-center">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => createNewSurvey(projectTitle.trim())}
                  className="p-4 w-[120px] active:bg-active-bluerounded-lg bg-primary-blue "
                >
                  <Text className="text-white text-center">Create</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
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
