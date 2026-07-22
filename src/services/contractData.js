import { API_URL } from "./api";

export async function contractEmployee(userData, token) {
  const response = await fetch(`${API_URL}/contract/employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      admission_date: 2026-07-20T00:00:00Z,
      terminatio_date: 2027-07-20T00:00:00Z,
      service_company_id: 1,
      user_id: 5,
      position: Software Developer

    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao criar contrato entre empresa e usuário`);
  }

  return response.json();
}

