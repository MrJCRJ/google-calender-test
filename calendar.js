async function listUpcomingEvents() {
  try {
    const request = {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    };

    const response = await gapi.client.calendar.events.list(request);
    const events = response.result.items;

    if (!events || events.length == 0) {
      document.getElementById("content").innerText = "Nenhum evento encontrado.";
      return;
    }

    const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      "Eventos:\n"
    );

    document.getElementById("content").innerText = output;
  } catch (err) {
    document.getElementById("content").innerText = err.message;
  }
}
