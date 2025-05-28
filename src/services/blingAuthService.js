const axios = require('axios');

const BLING_CLIENT_ID = process.env.BLING_CLIENT_ID;
const BLING_CLIENT_SECRET = process.env.BLING_CLIENT_SECRET;
const BLING_TOKEN_URL = process.env.BLING_TOKEN_URL;

let accessToken = null;
let tokenExpiresAt = null;

async function getBlingAccessToken() {
  const now = Date.now();

  if (accessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return accessToken;
  }

  console.log('🔑 Solicitando novo token Bling via OAuth2...');

  try {
    const response = await axios.post(
      BLING_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: BLING_CLIENT_ID,
        client_secret: BLING_CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in || 3600;
    tokenExpiresAt = now + expiresIn * 1000;

    console.log(`✅ Token Bling obtido. Expira em ${expiresIn} segundos.`);
    return accessToken;

  } catch (error) {
    console.error('❌ Erro ao obter token Bling:', error.response?.data || error.message);
    throw new Error('Falha ao obter token de autenticação Bling');
  }
}

module.exports = { getBlingAccessToken };
