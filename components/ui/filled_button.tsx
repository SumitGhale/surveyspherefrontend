import { Text, Pressable } from "react-native";
type Props = {
  onPress?: () => void;
  label?: string;
  classname?: string;
};

export default function FilledButton({
  onPress,
  label = "Submit",
  classname,
}: Props) {
  return (
    <Pressable
      className={`bg-primary-blue rounded-xl py-4 px-6 items-center justify-center active:bg-secondary-blue ${classname}`}
      onPress={onPress}
    >
      <Text className="text-white text-center">{label}</Text>
    </Pressable>
  );
}
