import { API_URL } from "./api";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login");
    }

    const data = await response.json();

    return data;

  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const sendEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => null);
    console.log(data)
    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || data?.error || "Erro ao enviar email.",
      };
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const resetPassword = async (code, password) => {
  try {
    const response = await fetch(`${API_URL}/password`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, password }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || data?.error || "Código inválido ou expirado.",
      };
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};