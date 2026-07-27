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

// -------------------------

export async function createOvertime(token, overtimeData) {
  if (!token) {
    throw {
      status: 401,
      message: "Usuário não autenticado.",
    };
  }

  const response = await fetch(`${API_URL}/overtime`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(overtimeData),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = {
      message: "Erro inesperado.",
    };
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || data.error || "Erro ao cadastrar.",
    };
  }

  return data;
}
