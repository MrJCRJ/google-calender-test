function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }

    // Salva o token no localStorage para reutilizar depois
    localStorage.setItem("google_calendar_token", JSON.stringify(gapi.client.getToken()));

    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    await listUpcomingEvents();
  };

  const storedToken = localStorage.getItem("google_calendar_token");

  if (storedToken) {
    // Se já tem um token salvo, reutiliza sem pedir autenticação
    gapi.client.setToken(JSON.parse(storedToken));
    listUpcomingEvents();
  } else {
    // Se não tem token, pede autorização
    tokenClient.requestAccessToken({ prompt: "consent" });
  }
}

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    localStorage.removeItem("google_calendar_token"); // Remove o token salvo
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

