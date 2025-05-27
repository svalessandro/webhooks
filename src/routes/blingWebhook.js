const express = require('express');
const router = express.Router();
const { enviarPedidoFoody } = require('../services/foodyService');

router.post('/bling', async (req, res) => {
  const pedido = req.body;

  console.log('📦 Webhook recebido do Bling:', pedido);

  try {
    await enviarPedidoFoody(pedido);
    res.status(200).send('Pedido processado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).send('Erro ao processar pedido');
  }
});

module.exports = router;
