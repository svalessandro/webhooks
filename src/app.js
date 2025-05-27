const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const blingWebhook = require('./routes/blingWebhook');

dotenv.config();

console.log('✅ FOODY_URL:', process.env.FOODY_OPEN_DELIVERY_URL);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use('/webhook', blingWebhook);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
