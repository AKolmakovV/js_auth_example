const CLIENT_ID = "0406d127fdb14a7c8c19482cf4eccdd5";
const REDIRECT_URI = "http://127.0.0.1:5500/index.html"; 

const authUrl = "https://oauth.yandex.ru/authorize";
const tokenUrl = "https://oauth.yandex.ru/token";

const loginBtn = document.getElementById("login");
const result = document.getElementById("result");

loginBtn.onclick = async () => {
  const codeVerifier = PKCE.randomString();
  const codeChallenge = await PKCE.sha256base64url(codeVerifier);

  sessionStorage.setItem("code_verifier", codeVerifier);

  const scopes = "wiki:read wiki:write login:email";

  const url =
    authUrl +
    `?response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256` +
    `&scope=${encodeURIComponent(scopes)}`;

  window.location.href = url;
};

async function handleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return;

  const codeVerifier = sessionStorage.getItem("code_verifier");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
    redirect_uri: REDIRECT_URI
  });

  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const json = await resp.json();
  result.textContent = "OAuth Response:\n" + JSON.stringify(json, null, 2);

  const respUserInfo = await fetch("https://login.yandex.ru/info?format=json", {
    headers: {
      "Authorization": `OAuth ${json.access_token}`
    }
  });

  const userInfo = await respUserInfo.json();
  result.textContent += "\n Email: " + JSON.stringify(userInfo, null, 2);
}

// Запускаем обработку
handleRedirect();