export const Messages = {
  SUCCESS: "Hora extra registrada com sucesso.",

  REQUIRED_DATE: "Informe a data inicial e a data final.",

  FUTURE_DATE:
    "Não é possível registrar horas extras para uma data futura.",

  REQUIRED_START: "Informe o horário inicial.",

  REQUIRED_END: "Informe o horário final.",

  INVALID_TIME:
    "O horário final deve ser posterior ao horário inicial.",

  INVALID_DATE_ORDER:
    "A data final não pode ser anterior à data inicial.",

  INVALID_DATE_RANGE: (maxDays) =>
    `O intervalo entre a data inicial e a final não pode ultrapassar ${maxDays} ${
      maxDays === 1 ? "dia" : "dias"
    }.`,  

  OUTSIDE_PERIOD:
    "A data informada está fora do período permitido. Verifique se selecionou o mês correto.",

  PERIOD_UNAVAILABLE:
    "Não foi possível confirmar o período vigente. Recarregue a página e tente novamente.",

  INVALID_COMMERCIAL_HOURS:
    "Em dias úteis, não é permitido registrar horas extras durante o horário comercial.",

  REQUIRED_JIRA:
    "Informe o código da tarefa Jira.",

  INVALID_JIRA:
    "Código Jira inválido. Use o formato PROJETO-123, por exemplo: DEV-123.",

  DUPLICATED:
    "Já existe um registro seu nesse mesmo horário.",

  OVERLAP:
    "Esse horário conflita com outro registro seu já existente.",

  NOT_FOUND:
    "Registro não encontrado. Ele pode ter sido removido ou alterado.",

  SESSION:
    "Sua sessão expirou. Faça login novamente para continuar.",

  FORBIDDEN:
    "Você não tem permissão para realizar esta ação.",

  RATE_LIMITED:
    "Muitas tentativas em pouco tempo. Aguarde alguns instantes e tente novamente.",

  NETWORK:
    "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.",

  VALIDATION:
    "Não foi possível validar os dados informados. Revise os campos e tente novamente.",

  SERVER:
    "Ocorreu um erro no servidor. Tente novamente em instantes.",

  UNKNOWN:
    "Algo deu errado. Tente novamente ou entre em contato com o suporte se o problema persistir.",

  MISSING_OVERTIME_ID:
    "Não foi possível identificar a hora extra.",

  NO_CHANGES:
    "Nenhuma alteração foi realizada.",

  EDIT_SUCCESS:
    "Hora extra editada com sucesso.",

  // =========================
  // CREATE USER
  // =========================

  NAME_SHORT:
    "O nome deve possuir pelo menos 3 caracteres.",

  NAME_LETTER:
    "O nome deve conter apenas letras.",

  DISPLAY_NAME_SHORT:
    "O nome de usuário deve possuir pelo menos 3 caracteres.",

  DISPLAY_NAME_SPACE:
    "O nome de usuário não pode conter espaços.",

  PHONE_INVALID:
    "O telefone deve possuir 10 ou 11 números.",

  PASSWORD_SHORT:
    "A senha deve possuir pelo menos 8 caracteres.",

  PASSWORD_LETTER:
    "A senha deve possuir pelo menos uma letra.",

  PASSWORD_NUMBER:
    "A senha deve possuir pelo menos um número.",

  EMAIL_INVALID:
    "Informe um endereço de email válido.",

  CPF_INVALID_LENGTH:
    "O CPF deve possuir 11 números.",

  CPF_INVALID:
    "Informe um CPF válido.",
};