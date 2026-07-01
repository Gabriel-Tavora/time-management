const API_URL = "http://192.168.1.21:5000";

export const login = async (email, senha) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  });

  if (!response.ok) {
    throw new Error("Email ou senha inválidos");
  }

  return await response.json();
};