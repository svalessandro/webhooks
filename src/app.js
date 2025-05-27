const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const blingWebhook = require('./routes/blingWebhook');
const foodyWebhook = require('./routes/foodyWebhook');

const app = express();
app.use(bodyParser.json());

app.use('/webhook/bling', blingWebhook);
app.use('/webhook/foody', foodyWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
