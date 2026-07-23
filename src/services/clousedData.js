import { API_URL } from "./api";

async function parseErrorMessage(response, fallback) {
  try {
    const data = await response.json();
    return data?.message || data?.error || fallback;
  } catch {
    return fallback;
  }
}

export async function getClousedMonth(token) {
  const response = await fetch(`${API_URL}/cloused`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      "Erro ao buscar dados"
    );
    throw new Error(`${message} (status ${response.status})`);
  }

  return response.json();
}

export async function getClousedMonthRecords(token, idCloused) {
  const response = await fetch(`${API_URL}/cloused/${idCloused}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      `Erro ao buscar horas do período fechado (id: ${idCloused})`
    );
    throw new Error(`${message} (status ${response.status})`);
  }

  return response.json();
}

async function updateMonthStatus(token, exerciceId, state) {
  console.log({
    exercice_id: exerciceId,
    state: state,
  });
  const response = await fetch(`${API_URL}/cloused`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ exercice_id: exerciceId, state: state }),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      `Erro ao atualizar competência ${exerciceId} para o status "${state}"`
    );
    throw new Error(`${message} (status ${response.status})`);
  }

  return response.json();
}

export const closeApprovedMonth = (token, id) =>
  updateMonthStatus(token, id, "PENDING_COORDINATOR_APPROVAL");

export const closeRejectedMonth = (token, id) =>
  updateMonthStatus(token, id, "REJECTED");