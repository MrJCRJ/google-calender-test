// Função principal para listar eventos
async function listUpcomingEvents() {
  const contentElement = document.getElementById("content");
  contentElement.innerText = "Carregando eventos...";

  try {
    // Busca todos os eventos no intervalo especificado
    const allEvents = await fetchAllEvents('2025-02-01T00:00:00.000Z', '2025-02-28T23:59:59.999Z');

    // Exibe os eventos ou uma mensagem se nenhum evento for encontrado
    if (allEvents.length === 0) {
      contentElement.innerText = "Nenhum evento encontrado.";
      return;
    }

    // Formata os eventos para exibição
    const output = formatEvents(allEvents);
    contentElement.innerText = output;
  } catch (err) {
    // Trata erros e exibe mensagens adequadas
    handleError(err, contentElement);
  }
}

// Função para buscar todos os eventos (com paginação)
async function fetchAllEvents(timeMin, timeMax) {
  let allEvents = [];
  let pageToken = null;

  do {
    const request = {
      calendarId: "primary",
      timeMin,
      timeMax,
      showDeleted: false,
      singleEvents: true,
      maxResults: 2500,
      orderBy: "startTime",
      pageToken,
    };

    const response = await gapi.client.calendar.events.list(request);
    allEvents = allEvents.concat(response.result.items);
    pageToken = response.result.nextPageToken;
  } while (pageToken);

  return allEvents;
}

// Função para formatar os eventos em uma string legível
function formatEvents(events) {
  return events.reduce((str, event) => {
    const startTime = event.start.dateTime
      ? new Date(event.start.dateTime).toLocaleString()
      : new Date(event.start.date).toLocaleDateString();

    const endTime = event.end?.dateTime
      ? new Date(event.end.dateTime).toLocaleString()
      : event.end?.date
        ? new Date(event.end.date).toLocaleDateString()
        : "Sem horário final";

    return `${str}${event.summary} (${startTime} → ${endTime})\n`;
  }, "Eventos:\n");
}

// Função para tratar erros
function handleError(err, contentElement) {
  let errorMessage = "Ocorreu um erro ao buscar os eventos.";

  if (err.result?.error?.code === 401) {
    errorMessage = "Erro de autenticação. Por favor, faça login novamente.";
  } else if (err.result?.error?.code === 403) {
    errorMessage = "Permissão negada. Verifique se você tem acesso ao calendário.";
  } else if (err.message.includes("network")) {
    errorMessage = "Erro de rede. Verifique sua conexão com a internet.";
  }

  console.error(errorMessage, err);
  contentElement.innerText = errorMessage;
}