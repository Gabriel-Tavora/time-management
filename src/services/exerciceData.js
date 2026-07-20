const API_URL = "http://192.168.1.21:5000";

export async function EmployeeDataAll(token) {
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

export async function EmployeeDataMonth(token) {
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
