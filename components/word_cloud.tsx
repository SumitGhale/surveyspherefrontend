import WordCloud from "rn-wordcloud";

// const data = [
//   { text: "happy", value: 8 },
//   { text: "joyful", value: 6 },
//   { text: "sad", value: 3 },
//   { text: "exciting", value: 7 },
//   { text: "angry", value: 4 },
//   { text: "hopeful", value: 8 },
//   { text: "inspiring", value: 9 },
//   { text: "dismal", value: 3 },
//   { text: "gloomy", value: 4 },
//   { text: "boring", value: 4 },
//   { text: "ordinary", value: 5 },
//   { text: "satisfied", value: 7 },
//   { text: "pleasing", value: 8 },
//   // Add more words as needed
// ];

export default function WordCloudComponent({ words }: { words: { text: string; value: number }[] }) {
  return (
    <WordCloud
      options={{
        words,
        verticalEnabled: true,
        minFont: 10,
        maxFont: 50,
        fontOffset: 1,
        width: 390,
        height: 250,
        fontFamily: "Arial",
      }}
    />
  );
}
