import { View, Text, ActivityIndicator } from "react-native";
import Animated, {
  CSSAnimationKeyframes,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function LoadingSpinner() {
  const pulse: CSSAnimationKeyframes = {
    from: {
      transform: [{ scale: 0.8 }, { rotateZ: "-360deg" }],
    },
    to: {
      transform: [{ scale: 1.2 }, { rotateZ: "360deg" }],
    },
  };
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Animated.View
        style={{
          animationName: pulse,
          animationDuration: "1s",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear",
          animationDirection:"alternate",
          shadowColor: "#15A4EC", // same as border color
          shadowOpacity: 1,
          shadowRadius: 100,
          elevation: 50,
        }}
        className="w-[50px] h-[50px] rounded-full border-4 border-r-primary-blue border-secondary-blue bg-white mb-6"
      >
      </Animated.View>
      <Text className="text-lg font-semibold tracking-wider text-primary-blue text-center">
        L o a d i n g
      </Text>
    </View>
  );
}
