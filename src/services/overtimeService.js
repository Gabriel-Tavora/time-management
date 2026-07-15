const API_URL = "http://192.168.1.21:5000";

export async function createOvertime(token, overtimeData) {
  if (!token) {
    throw new Error("Usuário não autenticado.");
  }
  console.log(JSON.stringify(overtimeData, null, 2));
  const response = await fetch(`${API_URL}/overtime`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(overtimeData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
}