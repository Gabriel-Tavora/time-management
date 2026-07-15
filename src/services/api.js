const API_URL = "http://192.168.1.21:5000/login";

export const login = async (email, password) => {
  try {
    const response = await fetch(API_URL, {
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

    console.log("Resposta:", data);

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};