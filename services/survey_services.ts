import { Survey } from "@/models/survey";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Implementation for getting all surveys
export const getAllSurveys = async (userId: string) => {
  try {
    console.log("Fetching surveys from:", `${BASE_URL}surveys/${userId}`);
    const response = await fetch(`${BASE_URL}surveys/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching surveys: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched surveys:", data);

    // Convert raw data to Survey objects
    const surveys: Survey[] = data.map((item: any) => ({
      id: item.id,
      host_id: item.host_id,
      title: item.title,
      code: item.code,
      status: item.status,
      time_created: item.time_created,
    }));

    console.log("Converted surveys:", surveys);

    return surveys;
  } catch (error) {
    console.error("Error fetching surveys:", error);
  }
};

// Implementation for creating a survey
export const createSurvey = async (survey: Survey) => {
  try {
    console.log("Creating survey:", survey);
    const response = await fetch(`${BASE_URL}surveys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(survey),
    });

    if (!response.ok) {
      let errorMsg = `Error creating survey: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData?.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log("Created survey:", data);

    // Return the created survey
    const createdSurvey: Survey = {
      id: data.id,
      host_id: data.host_id,
      title: data.title,
      code: data.code,
      status: data.status,
      time_created: data.time_created,
    };

    return createdSurvey;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};
