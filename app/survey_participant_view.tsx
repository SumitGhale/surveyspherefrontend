import { View, Text, Pressable, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { Question } from "@/models/question";
import { ActivityIndicator } from "react-native";
import { io } from "socket.io-client";
import { router, useLocalSearchParams } from "expo-router";
import Card from "@/components/ui/white-container";
import MultipleChoiceOption from "@/components/ui/multiple_choice_comp";
import { Rating } from "react-native-ratings";
import UnderlineTextField from "@/components/ui/underline_text_field";
import { createResponse } from "@/services/response_service";
import { Response } from "@/models/response";
import Animated, { SlideInRight } from "react-native-reanimated";
import { useAuth } from "@/contexts/userContext";

// ✅ Move components OUTSIDE
function OpenEndedOptions({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <Card>
      <UnderlineTextField
        value={value}
        onChangeText={onChangeText}
        placeholder="Your answer..."
      />
    </Card>
  );
}

function WordCloudOptions({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <Card>
      <UnderlineTextField
        placeholder="Your answer..."
        value={value}
        onChangeText={onChangeText}
      />
    </Card>
  );
}

function YesNoOptions({
  selectedValue,
  onSelect,
}: {
  selectedValue: string;
  onSelect: (val: string) => void;
}) {
  return (
    <Card>
      <MultipleChoiceOption
        label="Yes"
        selectedValue={selectedValue}
        onSelect={onSelect}
      />
      <MultipleChoiceOption
        label="No"
        selectedValue={selectedValue}
        onSelect={onSelect}
      />
    </Card>
  );
}

function RatingOptions({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <View className="items-start">
      <Rating
        type="custom"
        ratingColor="#059669"
        startingValue={value}
        imageSize={32}
        minValue={1}
        ratingCount={5}
        onFinishRating={onChange}
        tintColor="#f3f4f6"
      />
    </View>
  );
}

export default function SurveyParticipantView() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
    new Set()
  ); // ✅ Track answered questions
  const { user } = useAuth();

  const { code } = useLocalSearchParams();

  // ✅ Check if current question is already answered
  const currentQuestionId = questions?.[currentQuestionIndex]?.id;
  const hasAnswered = currentQuestionId
    ? answeredQuestions.has(currentQuestionId)
    : false;

  useEffect(() => {
    const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
    const socket = io(BASE_URL);

    socket.emit(
      "joinRoom",
      code,
      "participantName",
      (response: { success: any; message: any }) => {
        if (response.success) {
          console.log("Joined survey successfully");
        } else {
          console.error("Failed to join survey:", response.message);
        }
      }
    );

    socket.on("roomData", (data) => {
      console.log("Received room data:", data);
      setQuestions(data.questions);
    });

    socket.on("newQuestion", (data: { currentIndex: number }) => {
      setCurrentQuestionIndex(data.currentIndex);
      setAnswer(""); // Clear answer when question changes
    });

    socket.on("surveyEnded", () => {
      console.log("Survey has ended.");
      router.replace("/(tabs)");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmitResponse = async () => {
    if (!questions || !currentQuestionId) {
      console.warn("Missing question data. Unable to submit response.");
      return;
    }

    // ✅ Prevent duplicate submission
    if (hasAnswered) {
      console.log("Already answered this question");
      return;
    }

    // ✅ Validate answer exists
    if (!answer || answer.trim() === "") {
      console.warn("Please provide an answer");
      return;
    }

    const response: Response = {
      question_id: currentQuestionId,
      participant_id: user?.id,
      answer,
    };

    try {
      const data = await createResponse(response);

      // ✅ Mark question as answered
      setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionId));

      console.log("Response submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting response:", error);
      // ✅ Handle duplicate error from backend
      if (
        error instanceof Error &&
        error.message.includes("Already answered")
      ) {
        setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionId));
      }
    }
  };

  function MultipleChoiceOptions() {
    if (!questions) return <Text>No options found</Text>;
    return (
      <Card>
        {questions[currentQuestionIndex].options?.map((option, index) => (
          <MultipleChoiceOption
            key={index}
            label={option}
            selectedValue={answer}
            onSelect={setAnswer}
          />
        ))}
      </Card>
    );
  }

  const renderOptionsComponent = () => {
    if (!questions) return null;

    switch (questions[currentQuestionIndex].type) {
      case "rating":
        return (
          <RatingOptions
            value={parseFloat(answer) || 0}
            onChange={(val) => setAnswer(val.toString())}
          />
        );
      case "open-ended":
        return <OpenEndedOptions value={answer} onChangeText={setAnswer} />;
      case "yes/no":
        return <YesNoOptions selectedValue={answer} onSelect={setAnswer} />;
      case "word cloud":
        return <WordCloudOptions value={answer} onChangeText={setAnswer} />;
      case "multiple choice":
        return <MultipleChoiceOptions />;
      default:
        return <OpenEndedOptions value={answer} onChangeText={setAnswer} />;
    }
  };

  if (!questions) return <ActivityIndicator size="large" color="#15A4EC" />;

  return (
    <KeyboardAvoidingView className="p-3 bg-background-gray flex-1">
      <Animated.View
        key={currentQuestionIndex}
        entering={SlideInRight.duration(400)}
      >
        <Text className="font-bold text-3xl tracking-wider mb-6">
          {questions[currentQuestionIndex].text}
        </Text>

        {renderOptionsComponent()}

        <View className="mt-auto gap-3 pb-6">
          <Pressable
            onPress={handleSubmitResponse}
            disabled={hasAnswered} // ✅ Disable if already answered
            className={`p-3 rounded-lg items-center ${
              hasAnswered ? "bg-gray-400" : "bg-primary-blue"
            }`}
          >
            <Text className="text-white font-semibold">
              {hasAnswered ? "✓ Submitted" : "Submit"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              console.log("Survey ended by participant");
              router.replace("/(tabs)");
            }}
            className="p-3 rounded-lg items-center"
          >
            <Text className="text-red-500 font-semibold">Leave Survey</Text>
          </Pressable>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
