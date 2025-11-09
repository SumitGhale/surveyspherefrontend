import { View, TextInput } from "react-native";

type TextFieldProps = {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    className?: string;
};

export default function UnderlineTextField({
    value,
    onChangeText,
    placeholder,
    className = "",
}: TextFieldProps) {
    return (
        <View className="w-[100%] my-3 self-center ">
            <TextInput
                className={`border-b border-gray-300 p-4 text-gray-800 ${className}`}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af" // Tailwind gray-400
                value={value}
                onChangeText={(text) => onChangeText?.(text)}
            />
        </View>
    );
}
