import { API_URL } from "./api";

export async function getCurrentUser(token) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return await response.json();
}

export async function createUser(userData, token) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: userData?.name,
      display_name: userData?.display_name,
      email: userData?.email,
      password: userData?.password,
      cpf: userData?.cpf,
      phone: userData?.phone,
      role_id: userData?.role_id,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao criar usuário ${userData?.name}`);
  }

  return response.json();
}
