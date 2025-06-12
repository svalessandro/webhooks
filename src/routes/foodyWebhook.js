const express = require('express');
const { atualizarStatusPedidoBling } = require('../services/blingApiService');
const router = express.Router();

router.post('/', async (req, res) => {
  const { orderId, status } = req.body;

  console.log('📡 Webhook recebido da Foody:', JSON.stringify(req.body, null, 2));

  if (!orderId || !status) {
    console.error('❌ Payload da Foody incompleto.');
    return res.status(400).send('Dados inválidos.');
  }

  try {
    await atualizarStatusPedidoBling(orderId, status);
    res.status(200).send('Status enviado ao Bling.');
  } catch (error) {
    console.error('❌ Erro ao atualizar status no Bling:', error.message);
    res.status(500).send('Erro ao processar webhook.');
  }
});

module.exports = router;
