require('dotenv').config();
console.log('✅ FOODY_URL:', process.env.FOODY_OPEN_DELIVERY_URL);

const express = require('express');
const app = express();
const blingWebhook = require('./routes/blingWebhook');

app.use(express.json());
app.use('/webhook/bling', blingWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
