const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Código de autorização não encontrado.');
  }

  try {
    const response = await axios.post('https://www.bling.com.br/Api/v3/oauth/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://bling-foody-webhooks-production.up.railway.app/oauth/callback',
      client_id: process.env.BLING_CLIENT_ID,
      client_secret: process.env.BLING_CLIENT_SECRET,
    });

    const { access_token, refresh_token, expires_in } = response.data;

    console.log('🔐 Token de acesso recebido:', access_token);
    // Aqui você pode salvar os tokens como preferir

    res.send('Autorizado com sucesso! Token gerado. Veja logs do servidor.');
  } catch (error) {
    console.error('❌ Erro ao trocar código por token:', error.response?.data || error.message);
    res.status(500).send('Erro ao obter token de acesso.');
  }
});

module.exports = router;
