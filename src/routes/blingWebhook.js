const express = require('express');
const router = express.Router();

const { consultarPedidoBling } = require('../services/blingApiService');
const { enviarPedidoFoody } = require('../services/foodyService');

router.post('/bling', async (req, res) => {
  const pedidoBling = req.body.data;

  console.log('📦 Webhook recebido do Bling:', pedidoBling);

  if (!pedidoBling || !pedidoBling.id || !pedidoBling.numero) {
    console.error('❌ Pedido inválido ou incompleto.');
    return res.status(400).send('Dados do pedido inválidos.');
  }

  try {
    // Consulta detalhada no Bling, com fallback
    const pedidoDetalhado = await consultarPedidoBling(pedidoBling.id, pedidoBling.numero);

    // Envia para o Foody
    await enviarPedidoFoody(pedidoDetalhado);

    console.log('✅ Pedido processado com sucesso!');
    res.status(200).send('Pedido processado com sucesso.');

  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).send('Erro ao processar pedido.');
  }
});

module.exports = router;
