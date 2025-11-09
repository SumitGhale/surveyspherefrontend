import React from "react";
import Svg, { Defs, LinearGradient, Stop, Circle, Path } from "react-native-svg";

const PollyLogo = ({ size = 60 }) => (
  <Svg width={size} height={size} viewBox="0 0 160 160">
    <Defs>
      <LinearGradient id="parrotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#19c38dff" stopOpacity="1" />
        <Stop offset="100%" stopColor="#059669" stopOpacity="1" />
      </LinearGradient>
    </Defs>

    <Circle cx="80" cy="80" r="70" fill="url(#parrotGradient)" />
    <Circle cx="80" cy="75" r="25" fill="white" />
    <Circle cx="73" cy="72" r="5" fill="#1e293b" />
    <Circle cx="87" cy="72" r="5" fill="#1e293b" />
    <Path d="M80 80 L85 85 L80 85 Z" fill="#f59e0b" />
    <Path
      d="M55 85 Q50 75 55 65"
      stroke="white"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

export default PollyLogo;
