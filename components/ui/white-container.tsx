import { View, Text } from "react-native";

export default function Card({ children }) {
    return (
        <View className="bg-white rounded-2xl shadow-md p-5 w-[100%] self-center my-4">
            {children}
        </View>
    );
}
