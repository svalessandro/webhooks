const axios = require('axios');
const logger = require('../logger');

const FOODY_CLIENT_ID = process.env.FOODY_CLIENT_ID;
const FOODY_CLIENT_SECRET = process.env.FOODY_CLIENT_SECRET;
const FOODY_TOKEN_URL = process.env.FOODY_TOKEN_URL;

let accessToken = null;
let tokenExpiresAt = null;

async function getAccessToken() {
  const now = Date.now();

  if (accessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return accessToken;
  }

  logger.info('Solicitando novo token OAuth2 Foody');

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
    const expiresIn = response.data.expires_in || 3600; // fallback 1 hora
    tokenExpiresAt = now + expiresIn * 1000;

    logger.info(`Novo token Foody obtido. Expira em ${expiresIn}s`);
    return accessToken;

  } catch (error) {

    logger.error(
      {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      },
      'Erro ao obter token OAuth2 da Foody'
    );

    throw new Error('Falha ao obter token de autenticação');

  }
}

module.exports = { getAccessToken };