const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const blingWebhook = require('./routes/blingWebhook');

dotenv.config();

console.log('✅ FOODY_URL:', process.env.FOODY_OPEN_DELIVERY_URL);
console.log('✅ BLING_API_URL:', process.env.BLING_API_URL);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

// Rota de Webhook para receber eventos do Bling
app.use('/webhook', blingWebhook);

app.get('/', (req, res) => {
  res.send('🚀 Bling-Foody Integration API está rodando!');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
