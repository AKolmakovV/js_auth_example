import express from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const app = express();
app.use(express.json());

const CLIENT_ID = "ajek1btppl8bsuqa35ti";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const REDIRECT_URI = "http://localhost:5500/callback";
const TOKEN_URL = "https://auth.yandex.cloud/oauth/token";
const JWKS_URI = "https://auth.yandex.cloud/oauth/jwks/keys"; // Для получения публичного ключа

// JWKS клиент
const client = jwksClient({ jwksUri: JWKS_URI });

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Обмен code на JWT
app.post("/auth/callback", async (req, res) => {
  const { code } = req.body;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI
  });

  const tokenResp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const data = await tokenResp.json();
  res.json(data); // содержит id_token, access_token, refresh_token
});

// Защищённый роут
app.get("/api/data", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, getKey, {}, (err, decoded) => {
    if (err) return res.sendStatus(401);
    // decoded.payload содержит email, sub, roles и т.д.
    res.json({ message: "Доступ разрешён", user: decoded });
  });
});

app.listen(5500, () => console.log("Server running on http://localhost:5500"));
