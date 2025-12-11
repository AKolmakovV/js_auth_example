import fetch from "node-fetch";

const CLIENT_ID = "0406d127fdb14a7c8c19482cf4eccdd5";
const CLIENT_SECRET = "your_client_secret";
const TOKEN_URL = "https://oauth.yandex.ru/token"; 

async function getAccessToken() {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  });

  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!resp.ok) {
    throw new Error(`Token request failed: ${resp.status}`);
  }

  const data = await resp.json();
  console.log("Access token:", data.access_token);
  return data.access_token;
}

async function callApi() {
  const token = await getAccessToken();

  const apiResp = await fetch("https://login.yandex.ru/info?format=json", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const result = await apiResp.json();
  console.log(result);
}

callApi().catch(console.error);
