import QuestionCard from "@/components/question_card";
import {
  Pressable,
  Text,
  View,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { getAllQuestions, deleteQuestion } from "@/services/question_services";
import { useEffect, useState } from "react";
import { Question } from "@/models/question";
import { io } from "socket.io-client";
import { useQuestions } from "@/contexts/questionContext";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import LoadingSpinner from "@/components/ui/loading_spinner";

export default function EditSurveyScreen() {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const { questions, setQuestions } = useQuestions();
  const scrollY = useSharedValue(0);

  const { surveyId } = useLocalSearchParams();

  useEffect(() => {
    setQuestions([]);

    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getAllQuestions(surveyId as string);
        if (fetchedQuestions) {
          setQuestions(fetchedQuestions);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
    const socket = io("http://192.168.1.210:8000");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err?.message);
    });

    const handleIncoming = (payload: any) => {
      const raw = Array.isArray(payload) ? payload[0] : payload;
      if (!raw) return;

      const newQuestion: Question = {
        id: raw.id,
        text: raw.text ?? "",
        order_index: Number(raw.order_index) ?? 0,
        type: raw.type ?? "open-ended",
        options: raw.options ?? [],
        survey_id: raw.survey_id,
      };

      setQuestions((prev) => {
        const base = newQuestion.id
          ? prev.filter((q) => q.id !== newQuestion.id)
          : prev;
        const next = [...base, newQuestion];
        return next.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
      });
    };
    socket.on("newQuestion", handleIncoming);
  }, [surveyId, setQuestions]);

  const createRoom = () => {
    const socket = io("http://192.168.1.210:8000");

    socket.emit(
      "createRoom",
      { hostName: "Sumit", questions },
      (roomCode: any) => {
        if (roomCode) {
          console.log("Room created successfully", roomCode);
          router.push({
            pathname: "./survey_host_view",
            params: { roomCode: roomCode },
          });
        } else {
          console.error("Failed to create room");
        }
      }
    );
  };

  const addNewQuestion = () => {
    if (!surveyId) return;
    router.push({
      pathname: "./add_new_qsn",
      params: { surveyId: surveyId },
    });
  };

  const handleEdit = (question: Question) => {
    if (!question) return;
    router.push({
      pathname: "./question-builder",
      params: {
        question: JSON.stringify(question),
        questionType: question.type,
      },
    });
  };

  const handleDeletePress = (questionId?: string) => {
    if (!questionId) return;
    setQuestionToDelete(questionId);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      if (!questionToDelete) return;
      await deleteQuestion(questionToDelete);
      setQuestions((prev) => prev.filter((q) => q.id !== questionToDelete));
      setModalVisible(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return loading ? (
    <View className="flex-1 justify-center items-center">
    <ActivityIndicator size="large" color="#059669" />  
    </View>
  ) : (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
    >
      <Animated.ScrollView
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        className="p-4 space-y-4"
      >
        <View className="px-3 py-2 bg-card-background rounded-xl shadow-md">
          <Text className="text-2xl py-2 tracking-wide font-semibold">
            Importance of AI
          </Text>

          <View className="flex-row items-center rounded-lg py-2">
            <Text className="text-lg text-gray-600 mb-2">Questions</Text>
            <Pressable
              onPress={() => createRoom()}
              className="border-gray-300 border ml-auto bg-primary-blue active:bg-active-blue shadow-md px-5 py-3 rounded-2xl"
            >
              <Text className=" text-white text-primary-black">Go Live</Text>
            </Pressable>
          </View>
        </View>

        {questions.map((question, index) => (
          <QuestionCard
            key={question.id || index}
            question={question}
            handleEdit={handleEdit}
            handleDeletePress={handleDeletePress}
            index={index}
            scrollY={scrollY}
          />
        ))}

        {/* add new question */}
        <Pressable
          onPress={() => addNewQuestion()}
          className="px-3 border border-primary-blue active:bg-active-blue border-dashed items-center bg-primary-blue/5 rounded-md py-4 my-5 "
        >
          <Text className=" text-center text-primary-blue text-lg py-2 tracking-wide">
            + Add new question
          </Text>
        </Pressable>

        {/* delete modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView className="flex-1 items-center justify-center bg-black/50">
            <View className="bg-white rounded-lg w-[90%] max-w-md">
              <View className="border-b mb-4 border-gray-300">
                <Text className="m-4 text-xl text-center font-semibold">
                  Delete Question
                </Text>
              </View>
              <View className="px-5">
                <Text className="text-lg mb-2">Are you sure?</Text>
                <Text className="text-sm mb-6 text-gray-500">
                  This action cannot be undone. The question will be permanently
                  deleted.
                </Text>

                <View className="mb-6 flex-row justify-between">
                  <Pressable
                    onPress={() => {
                      setModalVisible(false);
                      setQuestionToDelete(null);
                    }}
                    className="p-4 w-[120px] rounded-lg bg-card-background"
                  >
                    <Text className="text-center">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={confirmDelete}
                    className="p-4 w-[120px] active:bg-red-700 rounded-lg bg-red-600"
                  >
                    <Text className="text-white text-center">Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
