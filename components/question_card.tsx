import { View, Text, Pressable } from "react-native";
import DeleteIcon from "./icons/trash";
import EditIcon from "./icons/pencil-icon";
import { Question } from "@/models/question";
import { TYPE_MAP } from "@/components/question-type-card";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const ITEM_HEIGHT = 250;
const ITEM_ANIMATION_SPAN = 200;

export default function QuestionCard({
  question,
  handleEdit,
  handleDeletePress,
  index,
  scrollY,
}: {
  question: Question;
  handleEdit: (question: Question) => void;
  handleDeletePress: (questionId?: string) => void;
  index: number;
  scrollY: any;
}) {
  const itemStartPosition = index * ITEM_HEIGHT;

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [
        itemStartPosition - ITEM_HEIGHT,
        itemStartPosition,
        itemStartPosition + ITEM_ANIMATION_SPAN,
      ],
      [1, 1, 0.5],
      "clamp"
    );
    const opacity = interpolate(
      scrollY.value,
      [
        itemStartPosition - ITEM_HEIGHT,
        itemStartPosition,
        itemStartPosition + ITEM_ANIMATION_SPAN,
      ],
      [1, 1, 0],
      "clamp"
    );
    return {
      transform: [{ scale }],
      opacity: opacity,
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="px-5 flex-row items-center bg-card-background rounded-xl py-4 my-2 shadow-md"
    >
      <View className="p-4 mr-3 bg-secondary-blue rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <Text className="text-lg">{TYPE_MAP[question.type]?.icon || "❓"}</Text>
      </View>
      <View className="flex-1">
        <Text numberOfLines={1} className="">
          {question.text}
        </Text>
        <Text className="text-gray-500">{question.type}</Text>
      </View>
      <View className="flex-row gap-5 ml-3">
        <Pressable onPress={() => handleEdit(question)}>
          <EditIcon size={20} color="black" />
        </Pressable>
        <Pressable onPress={() => handleDeletePress(question.id)}>
          <DeleteIcon size={20} color="red" />
        </Pressable>
      </View>
    </Animated.View>
  );
}
