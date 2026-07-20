const API_URL = "http://192.168.1.21:5000";

export async function EmployeeDataRecord(token, id) {
  const response = await fetch(`${API_URL}/overtime/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar dados");
  }

  return await response.json();
}