import { Question } from "@/models/question";
import { createContext, useState, useContext } from "react";

type QuestionContextType = {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
};

const QuestionContext = createContext<QuestionContextType | null>(null);

export default function QuestionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);

  return (
    <QuestionContext.Provider value={{ questions, setQuestions }}>
      {children}
    </QuestionContext.Provider>
  );
}
export function useQuestions() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionProvider");
  }
  return context;
}
