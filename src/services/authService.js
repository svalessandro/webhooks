const axios = require('axios');

const FOODY_URL = process.env.FOODY_OPEN_DELIVERY_URL;
const FOODY_CLIENT_ID = process.env.FOODY_CLIENT_ID;
const FOODY_CLIENT_SECRET = process.env.FOODY_CLIENT_SECRET;

let cachedToken = null;
let tokenExpiration = null;

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && tokenExpiration && now < tokenExpiration) {
    return cachedToken;
  }

  try {
    const response = await axios.post(
      `${FOODY_URL}/oauth/token`,
      new URLSearchParams({
        client_id: FOODY_CLIENT_ID,
        client_secret: FOODY_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, expires_in } = response.data;

    cachedToken = access_token;
    tokenExpiration = now + expires_in - 60; // buffer de 1 min

    console.log('✅ Novo token obtido com sucesso');

    return access_token;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.response?.data || error.message);
    throw new Error('Falha ao obter token de autenticação');
  }
}

module.exports = { getAccessToken };
