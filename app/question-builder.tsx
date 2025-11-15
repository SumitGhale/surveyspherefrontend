import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import DeleteIcon from "../components/icons/trash";
import Card from "@/components/ui/white-container";
import UnderlineTextField from "@/components/ui/underline_text_field";
import { TYPE_MAP } from "@/components/question-type-card";
import { useLocalSearchParams } from "expo-router";
import FilledButton from "@/components/ui/filled_button";
import { createQuestion, updateQuestion } from "@/services/question_services";
import { Question } from "@/models/question";
import { router } from "expo-router";

function MultipleChoiceOptions({
  options,
  setOptions,
}: {
  options: string[];
  setOptions: (opts: string[]) => void;
}) {
  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  return (
    <Card>
      <Text className="text-gray-600 text-xl mb-2">Options</Text>
      {options.map((option, index) => (
        <View key={index} className="flex-row items-center mb-2">
          <UnderlineTextField
            placeholder={`Option ${index + 1}`}
            value={option}
            onChangeText={(text) => handleOptionChange(text, index)}
            className="flex-1"
          />
          {options.length > 2 && (
            <Pressable
              onPress={() => handleRemoveOption(index)}
              className="ml-2"
            >
              <Text className="text-red-500 text-2xl">×</Text>
            </Pressable>
          )}
        </View>
      ))}
      <Pressable className="mt-2" onPress={handleAddOption}>
        <Text className="text-blue-500">+ Add Option</Text>
      </Pressable>
    </Card>
  );
}

export default function QuestionBuilder() {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [questionText, setQuestionText] = useState<string>("");

  const { questionType, question, surveyId } = useLocalSearchParams();
  const parsedQuestion = question
    ? (JSON.parse(question as string) as Question)
    : null;
  useEffect(() => {
    if (parsedQuestion) {
      setQuestionText(parsedQuestion.text);
      console.log("Parsed Question Options:", parsedQuestion.options);
      setOptions(parsedQuestion.options || ["", ""]);
    }
  }, [parsedQuestion]);
  const typeKey = questionType as string;
  const meta = TYPE_MAP[typeKey] ?? {
    icon: "❓",
    title: typeKey || "Unknown",
    message: "No description available for this question type",
  };

  const callCreateQuestion = async () => {
    const newQuestion: Question = {
      text: questionText,
      type: typeKey.toLowerCase(),
      options: options.filter((opt) => opt.trim() !== ""),
      survey_id: surveyId as string,
    };
    const result = await createQuestion(newQuestion);
    console.log("Created Question:", result);
    router.dismiss(2);
  };

  const callUpdateQuestion = async () => {
    try {
      if (parsedQuestion) {
        const updatedQuestion: Question = {
          ...parsedQuestion,
          text: questionText,
        };
        const result = await updateQuestion(updatedQuestion);
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  // Component for Rating scale
  function RatingOptions() {
    return (
      <Card>
        <Text className="text-gray-600 text-xl mb-2">Rating Scale</Text>
        <View>
          <UnderlineTextField placeholder="Min (e.g., 1)" />
          <UnderlineTextField placeholder="Max (e.g., 5)" />
        </View>
      </Card>
    );
  }

  // Component for Open-ended (no extra options needed)
  function OpenEndedOptions() {
    return (
      <Card>
        <Text className="text-gray-500 text-sm">
          Participants will be able to type a free-form response
        </Text>
      </Card>
    );
  }

  // Component for Yes/No (no extra options needed)
  function YesNoOptions() {
    return (
      <Card>
        <Text className="text-gray-500 text-sm">
          Participants will choose between Yes or No
        </Text>
      </Card>
    );
  }

  // Component for Word Cloud
  function WordCloudOptions() {
    return (
      <Card>
        <Text className="text-gray-500 text-sm">
          Participants will provide text responses that will be visualized in a
          word cloud
        </Text>
      </Card>
    );
  }

  const renderOptionsComponent = () => {
    switch (typeKey) {
      case "multiple choice":
        return (
          <MultipleChoiceOptions options={options} setOptions={setOptions} />
        );
      case "rating":
        return <RatingOptions />;
      case "open-ended":
        return <OpenEndedOptions />;
      case "yes/no":
        return <YesNoOptions />;
      case "word cloud":
        return <WordCloudOptions />;
      default:
        return <OpenEndedOptions />;
    }
  };

  return (
    <ScrollView className="flex-1 bg-background-grey p-4">
      <KeyboardAvoidingView>
        <View className="flex-row items-center justify-between my-5">
          <View className="flex-row gap-2 items-center">
            <Text className="text-xl ">{meta.icon}</Text>
            <Text className="text-xl font-semibold tracking-wider">
              {meta.title}
            </Text>
          </View>
        </View>

        {/* Question Input */}
        <Card>
          <Text className="text-gray-600 text-xl mb-2">Question</Text>
          <UnderlineTextField
            value={questionText}
            onChangeText={setQuestionText}
            placeholder="What would you like to ask?"
          />
        </Card>

        {/* Options Input */}
        {renderOptionsComponent()}

        <FilledButton
          label={`${parsedQuestion ? "Update" : "Create"} Question`}
          classname="my-2"
          onPress={() => {
            parsedQuestion ? callUpdateQuestion() : callCreateQuestion();
          }}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
