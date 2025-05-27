const express = require('express');
const router = express.Router();
const { enviarPedidoFoody } = require('../services/foodyService');

router.post('/bling', async (req, res) => {
  console.log('📦 Webhook recebido do Bling:', JSON.stringify(req.body, null, 2));

  try {
    await enviarPedidoFoody(req.body);
    res.status(200).send('Pedido processado e enviado para Foody!');
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message, error.response?.data || '');
    res.status(500).send('Erro ao processar pedido.');
  }
});

module.exports = router;
