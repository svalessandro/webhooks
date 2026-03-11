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
          Authorization:
            'Basic ' +
            Buffer.from(`${BLING_CLIENT_ID}:${BLING_CLIENT_SECRET}`).toString('base64')
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
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));

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

module.exports = { getBlingAccessToken };