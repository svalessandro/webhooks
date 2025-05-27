const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const blingWebhook = require('./routes/blingWebhook');

app.use(bodyParser.json());
app.use('/webhook', blingWebhook);

console.log('✅ FOODY_URL:', process.env.FOODY_OPEN_DELIVERY_URL);
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
