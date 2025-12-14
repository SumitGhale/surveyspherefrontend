import { View, Text, Pressable } from "react-native";
import { RadioButton } from "react-native-paper";

type Props = {
  label: string;
  selectedValue: string;
  onSelect: (value: string) => void;
};

export default function MultipleChoiceOption({ label, selectedValue, onSelect }: Props) {
  return (
    <Pressable onPress={() => onSelect(label)} className="flex-row justify-between items-center p-4 my-2 border rounded-lg border-gray-200">
      <Text>{label}</Text>
      <RadioButton
        color="#15A4EC"
        status={selectedValue === label ? "checked" : "unchecked"}
        value={label}
        onPress={() => onSelect(label)}
      />
    </Pressable>
  );
}
