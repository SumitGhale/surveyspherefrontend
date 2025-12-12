import { User } from "../models/user";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Create a new user
export const createUser = async (user: User) => {
  try {
    console.log("Creating user:", user);
    const response = await fetch(`${BASE_URL}users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      let errorMsg = `Error creating user: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData?.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log("Created user:", data);

    // Return the created user
    const createdUser: User = {
      id: data.id,
      email: data.email,
      name: data.name,
    };

    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};