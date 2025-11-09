import { View, Text, Pressable } from "react-native";

type surveyTypeProps = {
  status: string;
  title: string;
  questions: string;
  onPress?: () => void;
};

export default function Survey({ status, title, questions, onPress }: surveyTypeProps) {
  return (
    <Pressable
      onPress={ onPress}
      style={{ width: "48%" }}
      className="bg-white active:bg-active-blue border border-gray-300 rounded-lg  my-4 pt-4"
    >
      <View
        className={`mx-4 mb-2 p-2 rounded-lg self-start ${
          status === "completed" ? "bg-green-100" : "bg-primary-blue/5"
        }`}
      >
        <Text
          className={`${status === "completed" ? "text-green-700" : "text-primary-blue"}`}
        >
          {status}
        </Text>
      </View>
      <Text numberOfLines={1} className="mx-3 font-bold tracking-wider ">
        {title}
      </Text>
      <View className="mt-2 py-2 px-4 bg-gray-100">
        <Text className="text-gray-600">{questions}</Text>
      </View>
    </Pressable>
  );
}
