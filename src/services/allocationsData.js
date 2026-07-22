import { API_URL } from "./api";

export async function allocateEmployee(employee_id, companyData, token) {
  const response = await fetch(`${API_URL}/closed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      employee_contract_id: employee_id,
      company_contract_id: companyData?.contract_id,
      start_date: companyData?.start_date,
      end_date: companyData?.end_date,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao alocar o empregado`);
  }

  return response.json();
}