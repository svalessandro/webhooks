const axios = require('axios');

const BLING_API_URL = process.env.BLING_API_URL; // https://api.bling.com.br/Api/v3
const BLING_CLIENT_ID = process.env.BLING_CLIENT_ID;
const BLING_CLIENT_SECRET = process.env.BLING_CLIENT_SECRET;
const BLING_AUTH_CODE = process.env.BLING_AUTH_CODE; // gerado no processo OAuth

let accessToken = null;
let tokenExpiresAt = null;

async function getBlingAccessToken() {
  const now = Date.now();

  if (accessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return accessToken;
  }

  console.log('🔑 Solicitando novo token Bling via OAuth2...');

  try {
    const base64Credentials = Buffer.from(`${BLING_CLIENT_ID}:${BLING_CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(
      `${BLING_API_URL}/oauth/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: BLING_AUTH_CODE
      }),
      {
        headers: {
          'Authorization': `Basic ${base64Credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '1.0'
        }
      }
    );

    accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in || 21600; // 6 horas
    tokenExpiresAt = now + expiresIn * 1000;

    console.log(`✅ Token Bling obtido. Expira em ${expiresIn} segundos.`);
    return accessToken;

  } catch (error) {
    console.error('❌ Erro ao obter token Bling:', error.response?.data || error.message);
    throw new Error('Falha ao obter token de autenticação Bling');
  }
}

module.exports = { getBlingAccessToken };
