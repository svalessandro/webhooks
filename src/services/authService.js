const axios = require('axios');

const FOODY_CLIENT_ID = process.env.FOODY_CLIENT_ID;
const FOODY_CLIENT_SECRET = process.env.FOODY_CLIENT_SECRET;
const FOODY_TOKEN_URL = `${process.env.FOODY_OPEN_DELIVERY_URL}/oauth/token`;

let accessToken = null;
let tokenExpiresAt = null;

async function getAccessToken() {
  const now = Date.now();

  if (accessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return accessToken;
  }

  try {
    console.log('🔑 Solicitando novo token via OAuth2...');
    
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
    const expiresIn = parseInt(response.data.expires_in * 1000);  // Garantir milissegundos
    tokenExpiresAt = now + expiresIn;

    console.log(`✅ Novo token obtido com sucesso. Expira em ${response.data.expires_in} segundos.`);

    return accessToken;

  } catch (error) {
    console.error('❌ Erro ao obter token:', error.response?.data || error.message);
    throw new Error('Falha ao obter token de autenticação');
  }
}

module.exports = { getAccessToken };
