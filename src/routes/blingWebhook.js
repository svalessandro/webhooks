const express = require('express');
const router = express.Router();
const { obterDetalhesPedidoBling } = require('../services/blingService');
const { enviarPedidoFoody } = require('../services/foodyService');

router.post('/bling', async (req, res) => {
  console.log('📦 Webhook recebido do Bling:', req.body);

  const pedidoId = req.body.data?.id;

  if (!pedidoId) {
    console.error('❌ ID do pedido não encontrado.');
    return res.status(400).send('ID do pedido não encontrado');
  }

  try {
    const pedidoDetalhado = await obterDetalhesPedidoBling(pedidoId);

    await enviarPedidoFoody(pedidoDetalhado);

    res.status(200).send('Pedido processado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).send('Erro ao processar pedido');
  }
});

module.exports = router;
