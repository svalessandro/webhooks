const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const webhookData = req.body;

  console.log('📡 Webhook recebido da Foody:', JSON.stringify(webhookData, null, 2));

  res.status(200).send('OK');
});

module.exports = router;
