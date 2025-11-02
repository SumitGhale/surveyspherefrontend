import { createContext, useContext, useState } from "react";
import { Survey } from "@/models/survey";

type SurveyContextType = {
    surveys: Survey[];
    setSurveys:  React.Dispatch<React.SetStateAction<Survey[]>>
};

const SurveyContext =  createContext<SurveyContextType | null>(null)

export default function SurveyProvider({ children }: { children: React.ReactNode }) {
    const [surveys, setSurveys] = useState<Survey[]>([]);

    return (
        <SurveyContext.Provider value={{ surveys, setSurveys }}>
            {children}
        </SurveyContext.Provider>
    );
};

export function useSurveys() {
    const context = useContext(SurveyContext)
    if (!context){
        throw new Error("useSurveys must be used within a SurveyProvider");
    }
    return context;
}