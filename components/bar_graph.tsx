import { BarChart } from "react-native-gifted-charts";

export default function BarGraph({ data }: { data: any[] }) {
  return (
    <BarChart
      data={data}
      hideRules={true}
      isAnimated={true}
      // showXAxisIndices={true}
      barBorderRadius={5}
      frontColor={"#15A4EC"}
      showValuesAsTopLabel
      topLabelTextStyle={{
        color: "black",
        fontSize: 14,
        fontWeight: "bold",
      }}
      
    />
  );
}
