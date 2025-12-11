// Генерация случайной строки
function randomString(length = 64) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const randomValues = window.crypto.getRandomValues(new Uint8Array(length));
  randomValues.forEach(v => result += charset[v % charset.length]);
  return result;
}

// SHA-256 + base64url
async function sha256base64url(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hash);

  let base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

window.PKCE = {
  randomString,
  sha256base64url
};