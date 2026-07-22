import { API_URL } from "./api";

export async function employeeDataAll(token) {
  const response = await fetch(`${API_URL}/exercice`, {
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

export async function employeeDataMonth(token) {
  const response = await fetch(`${API_URL}/exercice/actual`, {
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

export async function closeMonth(token, idExercice) {
  const response = await fetch(`${API_URL}/exercice/${idExercice}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao fechar o exercício");
  }

  return await response.json();
}