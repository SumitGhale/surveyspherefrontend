import { Response } from "@/models/response";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Implementation for submitting a response
export const createResponse = async (
  payload: Response
) => {
  try {
    const res = await fetch(`${BASE_URL}responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || `Failed to create response (${res.status})`);
    }

    return data;
  } catch (error) {
    console.error("Error creating response:", error);
    throw error;
  }
};

export const getResponsesByQuestion = async (questionId: string) => {
  try {
    const res = await fetch(`${BASE_URL}responses/${questionId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch responses (${res.status})`);
    }

    const data = await res.json();
    return data as Response[];
  } catch (error) {
    console.error("Error fetching responses:", error);
    throw error;
  }
};