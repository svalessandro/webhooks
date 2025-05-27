const express = require('express');
const { enviarPedidoFoody } = require('../services/foodyService');

const router = express.Router();

router.post('/bling', async (req, res) => {
  const pedido = req.body;

  console.log('📦 Webhook recebido do Bling:', pedido);

  try {
    await enviarPedidoFoody(pedido);
    res.status(200).json({ message: 'Pedido processado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).json({ message: 'Erro ao processar pedido.' });
  }
});

module.exports = router;
