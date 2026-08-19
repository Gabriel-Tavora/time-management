import { API_URL } from "./api";
// rota 
export async function employeeDataRecord(token, id) {
  const response = await fetch(`${API_URL}/overtime/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    throw {
      status: response.status,
      message: data?.message || data?.error || "Erro ao buscar dados",
    };
  }

  return await response.json();
}

// rota do usuário normal para filtrar o período de horas extras
export async function getUserPerformance(token, monthStart, monthEnd) {
  const response = await fetch(
    `${API_URL}/overtime/userPerformance?periodStart=${monthStart}&periodEnd=${monthEnd}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    throw {
      status: response.status,
      message: data?.message || data?.error || "Erro ao buscar desempenho",
    };
  }

  return await response.json();
}

//rota que o gestor, coordenador e team-leader usa para buscar a performance de um funcionário
export async function getEmployeePerformance(token, employee_id, period_id) {
  const response = await fetch(
    `${API_URL}/overtime/performance?employee_id=${employee_id}&period_id=${period_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    throw {
      status: response.status,
      message: data?.message || data?.error || "Erro ao buscar desempenho",
    };
  }

  return await response.json();
}

// buscar horas do próprio usuário
export async function getUserHours(token) {
  const response = await fetch(`${API_URL}/overtime/employee`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    throw {
      status: response.status,
      message: data?.message || data?.error || "Erro ao buscar horas",
    };
  }

  return await response.json();
}
// -------------------------
// criar hora extra para dar post no registerHours
export async function createOvertime(token, overtimeData) {
  if (!token) {
    throw {
      status: 401,
      message: "Usuário não autenticado.",
    };
  };
  const response = await fetch(`${API_URL}/overtime`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(overtimeData),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = {
      message: "Erro inesperado.",
    };
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || data.error || "Erro ao cadastrar.",
    };
  }

  return data;
}

// edita hora extra já existente 

export async function editOvertime(token, idOvertime, overtimeData) {
  if (!token) {
    throw { status: 401, message: "Usuário não autenticado." };
  }

  if (!idOvertime) {
    throw { status: 400, message: "ID da hora extra não informado." };
  }

  const data = Object.fromEntries(
    Object.entries(overtimeData || {}).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  );

  if (Object.keys(data).length === 0) {
    throw { status: 400, message: "Nenhuma alteração para salvar." };
  }

  const response = await fetch(`${API_URL}/overtime/${idOvertime}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = { message: "Erro inesperado." };
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: result?.message || result?.error || "Erro ao editar hora extra.",
    };
  }

  return result;
}