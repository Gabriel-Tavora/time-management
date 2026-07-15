const API_URL = "http://192.168.1.21:5000";

export async function getUserHours(token) {
  const response = await fetch(`${API_URL}/overtime/employee`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar horas");
  }

  return await response.json();
}
