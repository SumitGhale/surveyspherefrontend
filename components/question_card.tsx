import { View, Text, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import DeleteIcon from "./icons/trash";
import EditIcon from "./icons/pencil-icon";
import { deleteQuestion } from "@/services/question_services";
import { Question } from "@/models/question";
import { useQuestions } from "@/contexts/questionContext";
import { TYPE_MAP } from "@/components/question-type-card";
import Animated,{ interpolate, useAnimatedStyle } from "react-native-reanimated";

const ITEM_HEIGHT = 250;
const ITEM_ANIMATION_SPAN = 200;

export default function QuestionCard({
  question,
  handleEdit,
  index,
  scrollY
}: {
  question: Question;
  handleEdit: (question: Question) => void;
    index: number;
    scrollY: any;
}) {
  const { setQuestions } = useQuestions();
  const itemStartPosition = index * ITEM_HEIGHT;

  const handleDelete = async (questionId?: string) => {
    try {
      if (!questionId) return;
      const ok = await deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
        scrollY.value,
        [
            itemStartPosition-ITEM_HEIGHT,
            itemStartPosition,
            itemStartPosition + ITEM_ANIMATION_SPAN
        ],
        [1, 1, 0.5],
        "clamp"
    )
    const opacity = interpolate(
        scrollY.value,
        [
            itemStartPosition-ITEM_HEIGHT,
            itemStartPosition,
            itemStartPosition + ITEM_ANIMATION_SPAN
        ],
        [1, 1, 0],
        "clamp"
    )
    return {
      transform: [{ scale }],
      opacity: opacity,
    };
  });

  return (
    <Animated.View style={animatedStyle} className="px-3 flex-row items-center bg-card-background rounded-md py-4 my-2 shadow-md">
      <View className="p-4 mr-3 bg-background-gray rounded-md shadow-sm">
        <Text className="text-lg">{TYPE_MAP[question.type]?.icon || "❓"}</Text>
      </View>
      <View className="flex-1">
        <Text numberOfLines={1} className="">
          {question.text}
        </Text>
        <Text className="text-gray-500">{question.type}</Text>
      </View>
      <View className="flex-row gap-2 ml-3">
        <Pressable onPress={() => handleEdit(question)}>
          <EditIcon size={20} color="black" />
        </Pressable>
        <Pressable onPress={() => handleDelete(question.id)}>
          <DeleteIcon size={20} color="red" />
        </Pressable>
      </View>
    </Animated.View>
  );
}
