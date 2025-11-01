import { View, Text } from "react-native";

type surveyTypeProps = {
  status: string;
  title: string;
  questions: string;
};

export default function Survey({ status, title, questions }: surveyTypeProps) {
  return (
    <View
      style={{ width: "48%" }}
      className="bg-white border border-gray-300 rounded-lg  my-4 pt-4"
    >
      <View
        className={`mx-4 mb-2 p-2 rounded-lg self-start ${
          status === "Completed" ? "bg-green-100" : "bg-secondary-blue"
        }`}
      >
        <Text className={`${status === "Completed" ? "text-green-700" : "text-primary-blue"}`}>{status}</Text>
      </View>
      <Text numberOfLines={1} className="mx-3 font-bold tracking-wider ">
        {title}
      </Text>
      <View className="mt-2 py-2 px-4 bg-gray-100">
        <Text className="text-gray-600">{questions}</Text>
      </View>
    </View>
  );
}
