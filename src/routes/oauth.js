const express = require('express');
const axios = require('axios');
const router = express.Router();
const { salvarTokens } = require('../services/tokenStorage');


router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Código de autorização não encontrado.');
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'https://webhooks-production-7dbf.up.railway.app/oauth/callback');

    const clientId = process.env.BLING_CLIENT_ID;
    const clientSecret = process.env.BLING_CLIENT_SECRET;
    const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await axios.post(
      'https://www.bling.com.br/Api/v3/oauth/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64Credentials}`
        }
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

console.log('🔐 Token de acesso recebido:', access_token);

// 💾 Salvar os tokens
salvarTokens({
  access_token,
  refresh_token,
  expires_in,
  obtained_at: new Date().toISOString()
});

res.send('Autorizado com sucesso! Token gerado e salvo em tokens.json.');

  } catch (error) {
    console.error('❌ Erro ao trocar código por token:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    res.status(500).send('Erro ao obter token de acesso.');
  }
});

module.exports = router;
