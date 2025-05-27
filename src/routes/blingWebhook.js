const express = require('express');
const router = express.Router();
const { enviarPedidoFoody } = require('../services/foodyService');

router.post('/bling', async (req, res) => {
  console.log('📦 Webhook recebido do Bling:', req.body);

  try {
    await enviarPedidoFoody(req.body);
    res.status(200).send('Pedido processado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error);
    res.status(500).send('Erro ao processar pedido');
  }
});

module.exports = router;
