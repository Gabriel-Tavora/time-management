import { API_URL } from "./api";

async function parseErrorMessage(response, fallback) {
  try {
    const data = await response.json();
    return data?.message || data?.error || fallback;
  } catch {
    return fallback;
  }
}
/* team-leader e cordenador */
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

  return await response.json();
}

/* 
{
  "id": 2,
  "exercice_id": 1,
  "state": "PENDING_COORDINATOR_APPROVAL",
  "cloused_by": 7,
  "cloused_at": "2026-07-22T16:44:28Z"
}
*/

// uso exclusivo do cordenador

async function updateMonthStatus(token, exerciceId, state) {
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
  updateMonthStatus(token, id, "PENDING_MANAGER_APPROVAL");

export const closeRejectedMonth = (token, id) =>
  updateMonthStatus(token, id, "REJECTED");

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

  return await response.json();
}

// uso exclusivo do manager

export async function getClousedMonthManager(token) {
  const response = await fetch(`${API_URL}/cloused/menager`, {
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

async function updateMonthStatusManager(token, exerciceId, state) {
  const response = await fetch(`${API_URL}/cloused/menager`, {
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
  console.log(response)
  return response;
}

export const closeApprovedMonthManager = (token, id) =>
  updateMonthStatusManager(token, id, "APPROVED");

export const closeRejectedMonthManager = (token, id) =>
  updateMonthStatusManager(token, id, "REJECTED");
