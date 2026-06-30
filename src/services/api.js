const API_URL = "http://localhost:3001";

export const login = async (email, senha) => {
  const response = await fetch(
    `${API_URL}/users?email=${email}&senha=${senha}`
  );

  return response.json();
};

export const getUserHours = async (id) => {
  const response = await fetch(
    `${API_URL}/registros?userId=${id}`
  );

  return response.json();
};