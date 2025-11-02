import QuestionCard from "@/components/question_card";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { getAllQuestions } from "@/services/question_services";
import { useEffect } from "react";
import { Question } from "@/models/question";
import { io } from "socket.io-client";
import { useQuestions } from "@/contexts/questionContext";
import Animated, {useAnimatedScrollHandler, useSharedValue} from "react-native-reanimated";
import LoadingSpinner from "@/components/ui/loading_spinner";

export default function EditSurveyScreen() {
  const { questions, setQuestions } = useQuestions();
  const scrollY = useSharedValue(0);

  const {surveyId} = useLocalSearchParams();

  useEffect(() => {

     setQuestions([]);
     
      const fetchQuestions = async () => {
        const fetchedQuestions = await getAllQuestions(surveyId as string);
        if (fetchedQuestions) {
          setQuestions(fetchedQuestions);
        }
      };
      fetchQuestions();
    const socket = io("http://192.168.1.163:8000");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err?.message);
    });

    // Handle both possible event names
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

    const handleEdit = (question: Question) => {
    if (!question) return;
    router.push({
      pathname: "./question-builder",
      params: { question: JSON.stringify(question) },
    });
  };

  const scrollHandler = useAnimatedScrollHandler((event)=> {
    scrollY.value = event.contentOffset.y;
  })

  return (

    !questions ? <LoadingSpinner /> :
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: "#f5f5f5"}}
    >
      <Animated.ScrollView
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        className="p-4 space-y-4"
      >
        <View className="px-3 py-2 flex-row items-center bg-card-background rounded-md shadow-md">
          <Text className="text-2xl py-2 tracking-wide font-semibold">
            Importance of AI
          </Text>
        </View>

        <View className="flex-row items-center rounded-md py-4">
          <Text className="text-lg text-gray-600 mb-2">Questions</Text>
          <Pressable
            onPress={() => router.push("/add_new_qsn")}
            className="border-gray-300 border ml-auto bg-primary-blue shadow-md px-4 py-2 rounded-md"
          >
            <Text className=" text-white text-primary-black">
              + Add Question
            </Text>
          </Pressable>
        </View>

        {questions.map((question, index) => (
          <QuestionCard
            key={question.id || index}
            question={question}
            handleEdit={handleEdit}
            index={index}
            scrollY={scrollY}
          />
        ))}

        {/* add new question */}
        <Pressable onPress={() => router.push("/add_new_qsn")} className="px-3 border border-primary-blue border-dashed items-center bg-secondary-blue rounded-md py-4 my-5 shadow-md">
          <Text className="text-center text-primary-blue text-lg py-2 tracking-wide">
            + Add new question
          </Text>
        </Pressable>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
