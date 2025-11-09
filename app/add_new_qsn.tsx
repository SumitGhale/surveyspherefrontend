import { SafeAreaView } from "react-native-safe-area-context";
import QuestionTypeCard from "@/components/question-type-card";
import { View } from "react-native";
import { router } from "expo-router";
import { use, useEffect, useState } from "react";
import { Question } from "@/models/question";
import { getAllQuestions } from "@/services/question_services";
import { useLocalSearchParams } from "expo-router";

export default function AddNewQuestionScreen() {

    const {surveyId} = useLocalSearchParams();

    const handleQuestionTypePress = (questionType: string) => {
        router.push({
            pathname: "./question-builder",
            params: { questionType, surveyId: surveyId },
        })
    };

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-row flex-wrap gap-y-4 justify-evenly ">
                <QuestionTypeCard question={"open-ended"} onPress={() => handleQuestionTypePress("open-ended")} />
                <QuestionTypeCard question={"multiple choice"} onPress={() => handleQuestionTypePress("multiple choice")} />
                <QuestionTypeCard question={"rating"} onPress={() => handleQuestionTypePress("rating")} />
                <QuestionTypeCard question={"yes/no"} onPress={() => handleQuestionTypePress("yes/no")} />
                <QuestionTypeCard question={"word cloud"} onPress={() => handleQuestionTypePress("word cloud")} />
            </View>
        </SafeAreaView>
    )
}