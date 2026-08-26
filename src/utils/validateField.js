export const validateField = (field, value) => {
  const trimmed = value?.trim() || "";
  if (field === "email" && trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "E-mail inválido.";
  }
  if (field === "phone" && trimmed && !/^[\d\s\-\+\(\)]{8,}$/.test(trimmed)) {
    return "Telefone inválido.";
  }
  if ((field === "name" || field === "display_name") && trimmed.length > 0 && trimmed.length < 2) {
    return "Nome muito curto.";
  }
  return null;
};