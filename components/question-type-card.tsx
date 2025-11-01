import React from "react";
import { Pressable, View, Text, GestureResponderEvent } from "react-native";

type Props = {
  question: string;
  className?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export const TYPE_MAP: Record<
  string,
  { icon: string; title: string; message: string }
> = {
  "multiple choice": {
    icon: "☑️",
    title: "Multiple Choice",
    message: "Let participants select from predefined options",
  },
  "open-ended": {
    icon: "📝",
    title: "Open-ended",
    message: "Participants can type a free-form response",
  },
  "rating": {
    icon: "⭐",
    title: "Rating",
    message: "Collect a score (e.g. 1 to 5)",
  },
  "yes/no": {
    icon: "👍",
    title: "Yes / No",
    message: "Simple binary choice",
  },
  "word cloud": {
    icon: "☁️",
    title: "Word Cloud",
    message: "Visualize common words from responses",
  },
};

export default function QuestionTypeCard({ question, className = "", onPress }: Props) {
  const typeKey = question ?? "";
  const meta = TYPE_MAP[typeKey] ?? {
    icon: "❓",
    title: typeKey || "Unknown",
    message: "No description available for this question type",
  };

  return (
    <Pressable
      onPress={onPress}
      className={
        `bg-card-background rounded-[18px] w-[45%] border border-blue-100 p-6 items-center justify-center ` +
        className
      }
      android_ripple={{ color: "rgba(0,0,0,0.05)" }}
      accessibilityRole="button"
    >
      <Text className="text-3xl mb-4 text-blue-500">{meta.icon}</Text>

      <Text className="text-xl font-semibold text-primary-black mb-2">
        {meta.title}
      </Text>

      <Text className="text-center text-sm text-gray-500">
        {meta.message}
      </Text>
    </Pressable>
  );
}