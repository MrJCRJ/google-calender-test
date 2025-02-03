async function listUpcomingEvents() {
  const contentElement = document.getElementById("content");
  contentElement.innerText = "Carregando eventos...";

  try {
    let allEvents = [];
    let pageToken = null;

    do {
      const request = {
        calendarId: "primary",
        timeMin: '2025-02-01T00:00:00.000Z',
        timeMax: '2025-02-28T23:59:59.999Z',
        showDeleted: false,
        singleEvents: true,
        maxResults: 2500,
        orderBy: "startTime",
        pageToken: pageToken,
      };

      const response = await gapi.client.calendar.events.list(request);
      const events = response.result.items;
      allEvents = allEvents.concat(events);

      pageToken = response.result.nextPageToken;
    } while (pageToken);

    if (allEvents.length === 0) {
      document.getElementById("content").innerText = "Nenhum evento encontrado.";
      return;
    }

    const output = allEvents.reduce((str, event) => {
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

    document.getElementById("content").innerText = output;
  } catch (err) {
    contentElement.innerText = err.message;
    document.getElementById("content").innerText = err.message;
  }
}