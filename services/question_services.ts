import { Question } from "@/models/question";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
// Implementation for creating a question
export const createQuestion = async (question: Question) => {
  try {
    const response = await fetch(`${BASE_URL}questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    });
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      console.error("Server error:", data);
      throw new Error(data.error || `Server error: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Error creating question:", error);
  }
};

// Implementation for getting all questions
export const getAllQuestions = async (survey_id:string) => {
  try {
    const response = await fetch(
      `${BASE_URL}questions/${survey_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error fetching questions: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched questions:", data);

    // Convert raw data to Question objects
    const questions: Question[] = data.map((item: any) => ({
      id: item.id,
      text: item.text,
      survey_id: item.survey_id,
      order_index: item.order_index,
      type: item.type,
      options: item.options || [],
    }));

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

// Implementation for deleting a question
export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await fetch(`${BASE_URL}questions/${questionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      // Try to read the error details from the response body
      const errorText = await response.text();
      throw new Error(`Error deleting question: ${errorText || response.statusText}`);
    }

    console.log(`Question with ID ${questionId} deleted successfully.`);
  } catch (error: any) {
    console.error("Error deleting question:", error.message);
    throw error;
  }
};

// Implementation for updating a question
export const updateQuestion = async(question: Question) => {
  try {
    const response = await fetch(`${BASE_URL}questions/${question.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: question.text }),
    });

    if (!response.ok) {
      throw new Error(`Error updating question: ${response.status}`);
    }

    const data = await response.json();
    console.log("Updated Question:", data);
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
}
