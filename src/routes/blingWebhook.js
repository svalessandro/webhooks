const express = require('express');
const router = express.Router();

const { consultarPedidoBling } = require('../services/blingApiService');
const { enviarPedidoFoody } = require('../services/foodyService');
const { transformarPedidoParaOpenDelivery } = require('../utils/foodyPayloadBuilder'); // Certifique-se de que o caminho está correto

router.post('/bling', async (req, res) => {
  const pedidoBling = req.body.data;

  console.log('📦 Webhook recebido do Bling:', pedidoBling);

  if (!pedidoBling || !pedidoBling.id || !pedidoBling.numero) {
    console.error('❌ Pedido inválido ou incompleto.');
    return res.status(400).send('Dados do pedido inválidos.');
  }

  try {
    // Consulta detalhada no Bling
    const pedidoDetalhado = await consultarPedidoBling(pedidoBling.id, pedidoBling.numero);
    const pedido = pedidoDetalhado?.data;

    if (!pedido || !pedido.id || !pedido.numero) {
      throw new Error('Pedido retornado do Bling está incompleto.');
    }

    // Transforma o pedido para o formato do Foody
    const payloadFoody = await transformarPedidoParaOpenDelivery(pedido); // ❗ agora com await
    console.log('🚀 Enviando pedido para Foody Open Delivery:', payloadFoody);
    await enviarPedidoFoody(payloadFoody);


    // Envia para a Foody
    await enviarPedidoFoody(payloadFoody);

    console.log('✅ Pedido processado com sucesso!');
    res.status(200).send('Pedido processado com sucesso.');

  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).send('Erro ao processar pedido.');
  }
});

module.exports = router;
