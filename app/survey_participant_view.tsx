import { View, Text, Pressable, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { Question } from "@/models/question";
import { ActivityIndicator } from "react-native";
import { io } from "socket.io-client";
import { router, useLocalSearchParams } from "expo-router";
import Card from "@/components/ui/white-container";
import MultipleChoiceOption from "@/components/ui/multiple_choice_comp";
import Slider from "@react-native-community/slider";
import UnderlineTextField from "@/components/ui/underline_text_field";
import { createResponse } from "@/services/response_service";
import { Response } from "@/models/response";
import Animated, { SlideInRight } from "react-native-reanimated";

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
    <Slider
      style={{ width: 200, height: 40 }}
      minimumValue={1}
      maximumValue={5}
      value={value}
      onValueChange={onChange}
      minimumTrackTintColor="#15A4EC"
      maximumTrackTintColor="#d1d5db"
    />
  );
}

export default function SurveyParticipantView() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { code } = useLocalSearchParams();

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
    if (questions) {
      const questionId = questions[currentQuestionIndex]?.id;
      if (!questionId) {
        console.warn("Missing question ID. Unable to submit response.");
        return;
      }

      const response: Response = {
        question_id: questionId,
        participant_id: "a95db083-e90d-432d-be54-81cf964d1d6d",
        answer,
      };

      try {
        const data = await createResponse(response);
        setAnswer("");
        console.log("Response submitted successfully:", data);
      } catch (error) {
        console.error("Error submitting response:", error);
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
            value={parseFloat(answer) || 1}
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
      <Animated.View key={currentQuestionIndex} entering={SlideInRight.duration(400)}>
        <Text className="font-bold text-3xl tracking-wider mb-6">
          {questions[currentQuestionIndex].text}
        </Text>

        {renderOptionsComponent()}

        <View className="mt-auto gap-3 pb-6">
          <Pressable
            onPress={handleSubmitResponse}
            className="bg-primary-blue p-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Submit</Text>
          </Pressable>

          <Pressable
            onPress={() => console.log("Survey ended")}
            className="p-3 rounded-lg items-center"
          >
            <Text className="text-red-500 font-semibold">End Survey</Text>
          </Pressable>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
