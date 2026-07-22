import { API_URL } from "./api";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login");
    }

    const data = await response.json();

    return data;
    
  } catch (err) {
    console.error(err);
    throw err;
  }
};