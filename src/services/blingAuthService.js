const axios = require('axios');

const BLING_CLIENT_ID = process.env.BLING_CLIENT_ID;
const BLING_CLIENT_SECRET = process.env.BLING_CLIENT_SECRET;
const BLING_TOKEN_URL = process.env.BLING_TOKEN_URL;  // exemplo: 'https://www.bling.com.br/Api/v3/oauth/token'

let accessToken = null;
let refreshToken = null;
let tokenExpiresAt = null;

/**
 * Troca o authorization_code por access_token e refresh_token.
 */
async function exchangeAuthorizationCodeForToken(authorizationCode) {
  console.log('🔑 Trocando authorization_code por access_token...');

  const credentials = Buffer.from(`${BLING_CLIENT_ID}:${BLING_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      BLING_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '1.0',
          'Authorization': `Basic ${credentials}`
        }
      }
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    const expiresIn = response.data.expires_in || 21600; // padrão 6 horas
    tokenExpiresAt = Date.now() + expiresIn * 1000;

    console.log(`✅ Access token obtido. Expira em ${expiresIn} segundos.`);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn
    };

  } catch (error) {
    console.error('❌ Erro ao trocar authorization_code:', error.response?.data || error.message);
    throw new Error('Falha na troca do authorization_code');
  }
}

/**
 * Obtém token válido, usando refresh_token se necessário.
 */
async function getBlingAccessToken() {
  const now = Date.now();

  if (accessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return accessToken;
  }

  if (refreshToken) {
    return await refreshAccessToken();
  }

  throw new Error('Nenhum token disponível. Realize a autorização inicial.');
}

/**
 * Usa refresh_token para obter novo access_token.
 */
async function refreshAccessToken() {
  console.log('🔄 Atualizando access_token via refresh_token...');

  const credentials = Buffer.from(`${BLING_CLIENT_ID}:${BLING_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      BLING_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '1.0',
          'Authorization': `Basic ${credentials}`
        }
      }
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    const expiresIn = response.data.expires_in || 21600;
    tokenExpiresAt = Date.now() + expiresIn * 1000;

    console.log(`✅ Novo access token obtido via refresh. Expira em ${expiresIn} segundos.`);
    return accessToken;

  } catch (error) {
    console.error('❌ Erro ao atualizar access_token:', error.response?.data || error.message);
    throw new Error('Falha ao atualizar access_token');
  }
}

module.exports = { 
  exchangeAuthorizationCodeForToken,
  getBlingAccessToken
};
