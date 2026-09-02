import { API_URL } from "./api";

export async function getClosureMonth(token, period) {
  const response = await fetch(
    `${API_URL}/closure?period=${period}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      "Erro ao buscar relatório"
    );

    throw new Error(`${message} (status ${response.status})`);
  }

  return response.json();
}

export async function getClosurePDFS(token, idClosure) {
  const response = await fetch(
    `${API_URL}/closure/${idClosure}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      "Erro ao buscar PDF"
    );

    throw new Error(`${message} (status ${response.status})`);
  }

  return response;
}