const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BLING_CLIENT_ID = process.env.BLING_CLIENT_ID;
const BLING_CLIENT_SECRET = process.env.BLING_CLIENT_SECRET;
const BLING_TOKEN_URL = process.env.BLING_TOKEN_URL;

let tokensPath = path.resolve(__dirname, '../../bling_tokens.json');

let tokens = {
  refresh_token: process.env.BLING_REFRESH_TOKEN,
  access_token: null,
  expires_at: null
};

// Carregar tokens do arquivo se existir
if (fs.existsSync(tokensPath)) {
  tokens = JSON.parse(fs.readFileSync(tokensPath));
}

async function getBlingAccessToken() {
  const now = Date.now();

  if (tokens.access_token && tokens.expires_at && now < tokens.expires_at) {
    return tokens.access_token;
  }

  if (!tokens.refresh_token) {
    throw new Error('Nenhum refresh token disponível. Realize a autorização inicial.');
  }

  console.log('🔑 Solicitando novo access token via refresh_token...');

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
          'Authorization': 'Basic ' + Buffer.from(`${BLING_CLIENT_ID}:${BLING_CLIENT_SECRET}`).toString('base64')
        }
      }
    );

    tokens.access_token = response.data.access_token;
    const expiresIn = response.data.expires_in || 3600;
    tokens.expires_at = now + expiresIn * 1000;

    if (response.data.refresh_token) {
      tokens.refresh_token = response.data.refresh_token;
      console.log(`🔄 Novo refresh_token recebido e salvo.`);
    }

    // Salva no arquivo
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));

    console.log(`✅ Novo access_token obtido. Expira em ${expiresIn} segundos.`);
    return tokens.access_token;

  } catch (error) {
    console.error('❌ Erro ao obter access token Bling:', error.response?.data || error.message);
    throw new Error('Falha ao obter token de autenticação Bling');
  }
}

async function exchangeAuthorizationCodeForToken(authorizationCode) {
  console.log('\uD83D\uDD04 Trocando authorization_code por tokens...');
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
          'Authorization': 'Basic ' + Buffer.from(`${BLING_CLIENT_ID}:${BLING_CLIENT_SECRET}`).toString('base64')
        }
      }
    );

    const now = Date.now();
    tokens.access_token = response.data.access_token;
    tokens.refresh_token = response.data.refresh_token;
    const expiresIn = response.data.expires_in || 3600;
    tokens.expires_at = now + expiresIn * 1000;

    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));
    console.log('\u2705 Tokens atualizados e salvos com sucesso.');
    return tokens;
  } catch (error) {
    console.error('\u274C Erro ao trocar authorization_code:', error.response?.data || error.message);
    throw new Error('Falha ao trocar authorization_code por tokens');
  }
}

module.exports = { getBlingAccessToken, exchangeAuthorizationCodeForToken };
