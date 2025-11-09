import { View, TextInput, Text } from "react-native";

type TextFieldProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

export default function GreyTextField({
    value,
    onChangeText,
    placeholder,
}: TextFieldProps) {
    return (
        <View className="w-[100%] my-3 self-center flex-1">
            <TextInput
                className="bg-gray-100 rounded-xl p-4 text-gray-800"
                placeholder={placeholder}
                placeholderTextColor="#9ca3af" // Tailwind gray-400
                value={value}
                onChangeText={(text) => onChangeText(text)}
            />
        </View>
    );
}
