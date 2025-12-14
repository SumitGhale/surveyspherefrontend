import { View, Text, Pressable, BackHandler } from "react-native";
import { useQuestions } from "@/contexts/questionContext";
import { useRef, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import BarGraph from "@/components/bar_graph";
import Pie_Chart from "@/components/pie_Chart";
import WordCloudComponent from "@/components/word_cloud";
import { getResponsesByQuestion } from "@/services/response_service";
import { Response } from "@/models/response";
import { Modal } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import * as Clipboard from "expo-clipboard";

export default function SurveyHostView() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { questions, setQuestions } = useQuestions();
  const { roomCode } = useLocalSearchParams();
  const [responses, setResponse] = useState<Response[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [participantCount, setParticipantCount] = useState(3); // Mock count, update from socket

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const socketRef = useRef<Socket | null>(null);
  const navigation = useNavigation();
  const allowLeaveRef = useRef(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(roomCode as string);
    // Optional: Show toast/alert
    console.log("Code copied!");
  };

  useEffect(() => {
    // Fetch responses whenever the current question changes
    const getResponses = async () => {
      if (!questions) return;
      const questionId = questions[currentQuestionIndex]?.id;
      if (!questionId) return;
      const res = await getResponsesByQuestion(questionId);
      console.log("Fetched responses for question:", res);
      setResponse(res);
    };
    getResponses();

    if (!BASE_URL) return;

    const socket = io(BASE_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Host connected:", socket.id);

      // Handle socket events - joining room
      socket.emit("joinRoom", roomCode, "host", (response: any) => {
        if (!response?.success) {
          console.error("Host failed to join:", response?.message);
        }
      });
    });

    socket.on("newResponse", (data: any) => {
      console.log("New response received:", data);
      // Refresh responses for the current question
      const getResponses = async () => {
        if (!questions) return;
        const questionId = questions[currentQuestionIndex]?.id;
        if (!questionId) return;
        const res = await getResponsesByQuestion(questionId);
        console.log("Fetched responses for question:", res);
        setResponse(res);
      };
      getResponses();
    });

    socket.on("connect_error", (err) =>
      console.error("Host socket error:", err)
    );
    socket.on("disconnect", () => console.log("Host socket disconnected"));

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [BASE_URL, roomCode, currentQuestionIndex]);

  // Intercept back navigation (header back + hardware back) to confirm ending survey
  useEffect(() => {
    const handleBeforeRemove = (e: any) => {
      if (allowLeaveRef.current) return;
      e.preventDefault();
      setModalVisible(true);
    };

    const unsubscribeNav = navigation.addListener(
      "beforeRemove",
      handleBeforeRemove
    );

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (allowLeaveRef.current) return false;
        setModalVisible(true);
        return true; // prevent default back action
      }
    );

    return () => {
      unsubscribeNav();
      backHandler.remove();
    };
  }, [navigation]);

  //  code to render different result components based on question type
  const renderResult = () => {
    if (!responses) return null;

    switch (questions[currentQuestionIndex].type) {
      case "multiple choice":
        return barChart(responses);
      case "open-ended":
        return wordCloud(responses);
      case "rating":
        return barChart(responses);
      case "yes/no":
        return pieChart(responses);
      default:
        return <Text>No results available for this question type.</Text>;
    }
  };

  const nextQuestion = () => {
    if (!socketRef.current) return;
    if (currentQuestionIndex >= questions.length - 1) {
      console.log("Survey ended");
      return;
    }
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    socketRef.current.emit("nextQuestion", {
      roomCode: roomCode,
      questionIndex: nextIndex,
    });
  };

  const endSurvey = () => {
    allowLeaveRef.current = true;
    setModalVisible(false);
    socketRef.current?.emit("endSurvey", { roomCode });
    router.replace("/(tabs)");
  };

  return (
    <Animated.View
      key={currentQuestionIndex}
      entering={SlideInRight.duration(400)}
      className="p-3 bg-background-gray flex-1"
    >
      {/* Survey Code Header */}
      <View className="bg-primary-blue rounded-xl p-4 mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-white/80 text-xs uppercase tracking-wide mb-1">
              Survey Code
            </Text>
            <Text className="text-white text-3xl font-bold tracking-widest">
              {roomCode}
            </Text>
          </View>
          <View className="items-center">
            <View className="flex-row items-center mb-1">
              <Text className="text-white text-2xl font-semibold mr-1">
                {participantCount}
              </Text>
              <Text className="text-white/80 text-xs">👥</Text>
            </View>
            <Text className="text-white/60 text-xs">participants</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-white/70 text-xs flex-1">
            Share this code with participants to join
          </Text>
          <Pressable
            onPress={copyToClipboard}
            className="bg-white/20 active:bg-white/30 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Text className="text-white text-sm font-semibold">📋 Copy</Text>
          </Pressable>
        </View>
      </View>

      <Text className="font-bold text-3xl tracking-wider mb-6">
        {questions[currentQuestionIndex].text}
      </Text>

      {/* Result Display */}
      <View className="mt-6 mx-auto">{renderResult()}</View>

      {/* Question Navigation */}
      <View className="mt-auto">
        <Pressable
          onPress={nextQuestion}
          disabled={currentQuestionIndex >= questions.length - 1}
          className={`p-3 my-2 rounded-lg items-center ${
            currentQuestionIndex >= questions.length - 1
              ? "bg-gray-400"
              : "bg-primary-blue"
          }`}
        >
          <Text className="text-white">
            {currentQuestionIndex >= questions.length - 1
              ? "Last Question"
              : "Next Question"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setModalVisible(true)}
          className="p-3 my-2 rounded-lg items-center"
        >
          <Text className="text-red-500">End Survey</Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white rounded-lg w-[90%] max-w-md">
            <View className="border-b mb-4 border-gray-300">
              <Text className="m-4 text-xl text-center font-semibold">
                End Survey
              </Text>
            </View>
            <View className="px-5">
              <Text className="text-lg mb-2">Are you sure?</Text>
              <Text className="text-sm mb-6 text-gray-500">
                This will end the survey for all participants. This action
                cannot be undone.
              </Text>

              <View className="mb-6 flex-row justify-between">
                <Pressable
                  onPress={() => {
                    setModalVisible(false);
                  }}
                  className="p-4 w-[120px] rounded-lg bg-card-background"
                >
                  <Text className="text-center">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => endSurvey()}
                  className="p-4 w-[120px] active:bg-red-700 rounded-lg bg-red-600"
                >
                  <Text className="text-white text-center">End Survey</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

function responseToChartData(responses: Response[]) {
  const answerCounts = responses.reduce(
    (acc, response) => {
      const answer = response.answer;
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(answerCounts).map(([text, value]) => ({
    text: text,
    label: text,
    value: value,
  }));
}

function barChart(responses: Response[]) {
  const data = responseToChartData(responses);
  console.log("Bar chart data:", data);
  return responses.length > 0 ? (
    <BarGraph data={data} />
  ) : (
    <Text>No responses yet.</Text>
  );
}

function pieChart(responses: Response[]) {
  const data = responseToChartData(responses);
  console.log("Pie chart data:", data);
  return responses.length > 0 ? (
    <Pie_Chart data={data} />
  ) : (
    <Text>No responses yet.</Text>
  );
}

function wordCloud(responses: Response[]) {
  return responses.length > 0 ? (
    <WordCloudComponent
      key={`wordcloud-${responses.length}`}
      words={responseToChartData(responses)}
    />
  ) : (
    <Text>No responses yet.</Text>
  );
}
