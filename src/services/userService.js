const API_URL = "http://192.168.1.21:5000";

export async function getCurrentUser(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return response.json();
}