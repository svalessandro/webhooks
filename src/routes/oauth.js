const express = require('express');
const axios = require('axios');
const router = express.Router();

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
    params.append('client_id', process.env.BLING_CLIENT_ID);
    params.append('client_secret', process.env.BLING_CLIENT_SECRET);

    const response = await axios.post(
      'https://www.bling.com.br/Api/v3/oauth/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    console.log('🔐 Token de acesso recebido:', access_token);
    res.send('Autorizado com sucesso! Token gerado. Veja logs do servidor.');

  } catch (error) {
    console.error('❌ Erro ao trocar código por token:', error.response?.data || error.message);
    res.status(500).send('Erro ao obter token de acesso.');
  }
});

module.exports = router;
