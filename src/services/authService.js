const axios = require('axios');

const FOODY_CLIENT_ID = process.env.FOODY_CLIENT_ID;
const FOODY_CLIENT_SECRET = process.env.FOODY_CLIENT_SECRET;
const FOODY_TOKEN_URL = process.env.FOODY_TOKEN_URL;

let accessToken = null;
let tokenExpiresAt = null;

async function getAccessToken() {
  const now = Date.now();

  if (!FOODY_TOKEN_URL) {
    console.error('❌ FOODY_TOKEN_URL não está definido no ambiente!');
    throw new Error('FOODY_TOKEN_URL ausente');
  }

  if (!FOODY_CLIENT_ID || !FOODY_CLIENT_SECRET) {
    console.error('❌ FOODY_CLIENT_ID ou FOODY_CLIENT_SECRET não estão definidos!');
    throw new Error('Credenciais de cliente ausentes');
  }

  if (accessToken && tokenExpiresAt && now < tokenExpiresAt) {
    console.log('✅ Usando token em cache');
    return accessToken;
  }

  console.log('🔑 Solicitando novo token via OAuth2...');

  try {
    const response = await axios.post(
      FOODY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: FOODY_CLIENT_ID,
        client_secret: FOODY_CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in; // em segundos
    tokenExpiresAt = now + expiresIn * 1000;

    console.log('✅ Novo token obtido com sucesso. Expira em', expiresIn, 'segundos.');

    return accessToken;

  } catch (error) {
    console.error('❌ Erro ao obter token:', error.response?.data || error.message);
    throw new Error('Falha ao obter token de autenticação');
  }
}

module.exports = { getAccessToken };
