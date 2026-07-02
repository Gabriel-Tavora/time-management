const API_URL = "http://192.168.1.21:5000/login";

export const login = async (email, password) => {
  try {
  console.log({
  email,
  password,
  API_URL,
  url: `${API_URL}`,
});
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  console.log(response);

  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Erro ao fazer login");
  }

  return await response.json();
} catch (err) {
  console.error("Erro de conexão:", err);
  throw err;
}
};
