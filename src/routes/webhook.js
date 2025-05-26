// src/routes/webhook.js
import express from 'express';
const router = express.Router();

router.post('/bling', (req, res) => {
  console.log('📦 Webhook recebido do Bling:');
  console.dir(req.body, { depth: null });

  res.status(200).send('OK');
});

export default router;
