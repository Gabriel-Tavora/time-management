export const Messages = {
  SUCCESS: "Hora extra registrada com sucesso!",

  REQUIRED_DATE: "Informe a data inicial e final.",

  FUTURE_DATE: "Não é permitido registrar horas com mais de 1 dia e meio de antecedência.",

  REQUIRED_START: "Informe o horário inicial.",

  REQUIRED_END: "Informe o horário final.",

  INVALID_TIME:
    "O horário final deve ser maior que o horário inicial.",

  INVALID_DATE_ORDER:
    "A data final não pode ser anterior à data inicial.",

  INVALID_DATE_RANGE:
    "O intervalo entre a data inicial e a final não pode ultrapassar 1 dia.",

  OUTSIDE_PERIOD:
    "A data informada está fora do período do mês atual.",

  PERIOD_UNAVAILABLE:
    "Não foi possível confirmar o período vigente. Recarregue a página e tente novamente.",

  REQUIRED_JIRA:
    "Informe o código da tarefa Jira.",

  INVALID_JIRA:
    "Código Jira inválido. Exemplo: DEV-123.",

  DUPLICATED:
    "Já existe uma hora cadastrada nesse mesmo horário.",

  OVERLAP:
    "Existe conflito entre o horário informado em outro registro.",

  SESSION:
    "Sua sessão expirou. Faça login novamente.",

  FORBIDDEN:
    "Você não possui permissão para realizar esta operação.",

  SERVER:
    "Erro interno do servidor.",

  UNKNOWN:
    "Erro inesperado. Tente novamente.",
};