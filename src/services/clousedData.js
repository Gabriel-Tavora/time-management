import { API_URL } from "./api";

export async function getClousedMonth(token) {
  const response = await fetch(`${API_URL}/cloused`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar dados");
  }

  return response.json();
}

export async function getClousedMonthRecords(token, idCloused) {
  const response = await fetch(`${API_URL}/cloused/${idCloused}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar horas do período fechado");
  }

  return response.json();
}

async function updateMonthStatus(token, exerciceId, state) {
  const response = await fetch(`${API_URL}/cloused`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ exercice_id: exerciceId, state }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao atualizar competência para ${state}`);
  }

  return response.json();
}

export const closeApprovedMonth = (token, id) =>
  updateMonthStatus(token, id, "PENDING_COORDINATOR_APPROVAL");

export const closeRejectedMonth = (token, id) =>
  updateMonthStatus(token, id, "REJECTED");
