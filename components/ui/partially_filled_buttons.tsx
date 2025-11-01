import { Pressable, Text } from "react-native";


export default function PartiallyFilledButtons({ onPress }: { onPress: () => void }) {
    return (
        <Pressable className="bg-secondary-blue rounded-xl py-4 px-6 items-center justify-center" onPress={onPress}>
            <Text className="text-primary-blue font-bold text-center tracking-wider">Create +</Text>
        </Pressable>
    );
}