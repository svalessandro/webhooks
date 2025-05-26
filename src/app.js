const express = require('express');
const bodyParser = require('body-parser');
const webhookRoutes = require('./routes/webhook');
const oauthRoutes = require('./routes/oauth');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/webhook', webhookRoutes);
app.use('/oauth', oauthRoutes);

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
