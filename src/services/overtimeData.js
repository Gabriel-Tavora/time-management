import { API_URL } from "./api";

export async function employeeDataRecord(token, id) {
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
