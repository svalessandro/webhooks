const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const blingWebhook = require('./routes/blingWebhook');
const foodyWebhook = require('./routes/foodyWebhook'); // ✅ Importa o webhook do Foody
const { exchangeAuthorizationCodeForToken } = require('./services/blingAuthService');
const logger = require('./logger');

dotenv.config();

logger.info({ FOODY_URL: process.env.FOODY_OPEN_DELIVERY_URL }, 'FOODY_URL carregada');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'bling-foody-integration',
    timestamp: new Date().toISOString()
  });
});

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

  logger.info({ code }, 'Authorization code recebido do Bling');

  try {
    const tokens = await exchangeAuthorizationCodeForToken(code);

    res.send(`✅ Tokens obtidos com sucesso: ${JSON.stringify(tokens)}`);

  } catch (error) {

    logger.error(
      { message: error.message },
      'Erro ao trocar authorization_code'
    );

    res.status(500).send('❌ Erro ao trocar authorization_code');
  }
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Servidor iniciado');
});

const errorHandler = require('./middlewares/errorHandler');

app.use(errorHandler);