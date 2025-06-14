const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const blingWebhook = require('./routes/blingWebhook');
const foodyWebhook = require('./routes/foodyWebhook'); // ✅ Importa o webhook do Foody
const { exchangeAuthorizationCodeForToken } = require('./services/blingAuthService');

dotenv.config();

console.log('✅ FOODY_URL:', process.env.FOODY_OPEN_DELIVERY_URL);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

// ✅ Rota do webhook do Foody
app.use('/webhook/foody', foodyWebhook);

// Rota para webhooks do Bling
app.use('/webhook', blingWebhook);

// Rota de callback do Bling
app.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('❌ Authorization code não encontrado.');
  }

  console.log('🔑 Recebido authorization_code:', code);
  try {
    const tokens = await exchangeAuthorizationCodeForToken(code);
    res.send(`✅ Tokens obtidos com sucesso: ${JSON.stringify(tokens)}`);
  } catch (error) {
    console.error('❌ Erro ao trocar authorization_code:', error.message);
    res.status(500).send('❌ Erro ao trocar authorization_code');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
