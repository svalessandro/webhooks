const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log('📦 Webhook recebido do Bling:', JSON.stringify(req.body, null, 2));
  res.status(200).send('OK');
});


module.exports = router;
