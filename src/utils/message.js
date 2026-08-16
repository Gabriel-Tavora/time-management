export const Messages = {
  SUCCESS: "Hora extra registrada com sucesso!",

  REQUIRED_DATE: "Informe a data inicial e a data final.",

  FUTURE_DATE:
    "Não é possível registrar horas com mais de 1 dia e meio de antecedência.",

  REQUIRED_START: "Informe o horário inicial.",

  REQUIRED_END: "Informe o horário final.",

  INVALID_TIME: "O horário final deve ser depois do horário inicial.",

  INVALID_DATE_ORDER: "A data final não pode ser anterior à data inicial.",

  INVALID_DATE_RANGE: (maxDays) =>
    `O intervalo entre a data inicial e a final não pode ultrapassar ${maxDays} ${maxDays === 1 ? "dia" : "dias"}.`,

  OUTSIDE_PERIOD:
    "Essa data está fora do período do mês atual. Verifique se selecionou o mês certo.",

  PERIOD_UNAVAILABLE:
    "Não foi possível confirmar o período vigente. Recarregue a página e tente novamente.",

  REQUIRED_JIRA: "Informe o código da tarefa Jira.",

  INVALID_JIRA: "Código Jira inválido. Use o formato PROJETO-123, ex: DEV-123.",

  DUPLICATED: "Já existe um registro seu nesse mesmo horário.",

  OVERLAP: "Esse horário conflita com outro registro seu já existente.",

  NOT_FOUND: "Registro não encontrado. Ele pode ter sido removido ou alterado.",

  SESSION: "Sua sessão expirou. Faça login novamente para continuar.",

  FORBIDDEN: "Você não tem permissão para realizar esta ação.",

  RATE_LIMITED:
    "Muitas tentativas em pouco tempo. Aguarde alguns instantes e tente novamente.",

  NETWORK:
    "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.",

  VALIDATION:
    "Não foi possível validar os dados informados. Revise os campos e tente novamente.",

  SERVER: "Ocorreu um erro no servidor. Tente novamente em instantes.",

  UNKNOWN:
    "Algo deu errado. Tente novamente ou entre em contato com o suporte se o problema persistir.",
};
