const express = require('express');
const router = express.Router();
const { enviarPedidoFoody } = require('../services/foodyService');

router.post('/', async (req, res) => {
  const pedidoBling = req.body;

  console.log('📦 Webhook recebido do Bling:', JSON.stringify(pedidoBling, null, 2));

  try {
    await enviarPedidoFoody(pedidoBling);
    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Erro ao enviar pedido para Foody:', err);
    res.status(500).send('Erro ao enviar pedido para Foody.');
  }
});

module.exports = router;
