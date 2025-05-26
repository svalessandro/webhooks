require('dotenv').config(); // <-- carrega variáveis de ambiente
const express = require('express');
const cors = require('cors');
const webhookRoutes = require('./routes/webhook');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/webhook', webhookRoutes);

const oauthRoutes = require('./routes/oauth');
app.use('/oauth', oauthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
