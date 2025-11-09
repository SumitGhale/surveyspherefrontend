import { PieChart } from "react-native-gifted-charts";

export default function Pie_Chart({ data }: { data: any[] }) {
  return (
    <PieChart
      data={data}
      isAnimated={true}
      radius={150}
      innerRadius={30}
      showText
      textColor="white"
    />
  );
}
