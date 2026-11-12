const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('../logger');

const BLING_CLIENT_ID = process.env.BLING_CLIENT_ID;
const BLING_CLIENT_SECRET = process.env.BLING_CLIENT_SECRET;
const BLING_TOKEN_URL = process.env.BLING_TOKEN_URL;

const tokensPath = path.resolve(__dirname, '../../bling_tokens.json');

let tokens = {
  refresh_token: process.env.BLING_REFRESH_TOKEN,
  access_token: null,
  expires_at: null
};

// Carregar tokens do arquivo se existir
if (fs.existsSync(tokensPath)) {
  try {
    tokens = JSON.parse(fs.readFileSync(tokensPath));
    logger.info('Tokens do Bling carregados do arquivo');
  } catch (error) {
    logger.error({ error }, 'Erro ao ler arquivo de tokens do Bling');
  }
}

function basicAuthHeader() {
  return (
    'Basic ' +
    Buffer.from(`${BLING_CLIENT_ID}:${BLING_CLIENT_SECRET}`).toString('base64')
  );
}

function salvarTokens() {
  fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));
}

async function getBlingAccessToken() {

  const now = Date.now();

  if (tokens.access_token && tokens.expires_at && now < tokens.expires_at) {
    return tokens.access_token;
  }

  if (!tokens.refresh_token) {
    logger.error('Refresh token do Bling não disponível');
    throw new Error('Nenhum refresh token disponível. Realize a autorização inicial.');
  }

  logger.info('Solicitando novo access token do Bling via refresh_token');

  try {

    const response = await axios.post(
      BLING_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokens.refresh_token
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: basicAuthHeader()
        }
      }
    );

    tokens.access_token = response.data.access_token;

    const expiresIn = response.data.expires_in || 3600;

    tokens.expires_at = now + expiresIn * 1000;

    if (response.data.refresh_token) {
      tokens.refresh_token = response.data.refresh_token;

      logger.info('Novo refresh_token recebido do Bling');
    }

    // Salva tokens no arquivo
    salvarTokens();

    logger.info(
      { expiresIn },
      'Novo access_token do Bling obtido'
    );

    return tokens.access_token;

  } catch (error) {

    logger.error(
      {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      },
      'Erro ao obter access token do Bling'
    );

    throw new Error('Falha ao obter token de autenticação Bling');
  }
}

// Troca o authorization_code (callback OAuth2) por tokens e salva no servidor.
// Os tokens não são devolvidos ao chamador nem registrados no log.
async function exchangeAuthorizationCodeForToken(code) {

  logger.info('Trocando authorization_code por tokens do Bling');

  try {

    const response = await axios.post(
      BLING_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: basicAuthHeader()
        }
      }
    );

    const expiresIn = response.data.expires_in || 3600;

    tokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Date.now() + expiresIn * 1000
    };

    salvarTokens();

    logger.info({ expiresIn }, 'Tokens do Bling obtidos e salvos');

  } catch (error) {

    logger.error(
      {
        status: error.response?.status,
        message: error.message
      },
      'Erro ao trocar authorization_code'
    );

    throw new Error('Falha ao trocar authorization_code');
  }
}

module.exports = { getBlingAccessToken, exchangeAuthorizationCodeForToken };
