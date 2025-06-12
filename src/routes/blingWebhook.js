const express = require('express');
const router = express.Router();

const { consultarPedidoBling } = require('../services/blingApiService');
const { enviarPedidoFoody, atualizarStatusPedidoFoody } = require('../services/foodyService');
const { transformarPedidoParaOpenDelivery } = require('../utils/foodyPayloadBuilder');

router.post('/bling', async (req, res) => {
  const pedidoBling = req.body.data;

  console.log('📦 Webhook recebido do Bling:', pedidoBling);

  if (!pedidoBling || !pedidoBling.id || !pedidoBling.numero) {
    console.error('❌ Pedido inválido ou incompleto.');
    return res.status(400).send('Dados do pedido inválidos.');
  }

  try {
    // Consulta os dados detalhados do pedido
    const pedidoDetalhado = await consultarPedidoBling(pedidoBling.id, pedidoBling.numero);
    const pedido = pedidoDetalhado?.data;

    if (!pedido || !pedido.id || !pedido.numero) {
      throw new Error('Pedido retornado do Bling está incompleto.');
    }

    // Transforma o pedido para o formato exigido pela Foody
    const payloadFoody = await transformarPedidoParaOpenDelivery(pedido);

    // Envia o pedido para a Foody
    console.log('🚀 Enviando pedido para Foody Open Delivery:', payloadFoody);
    await enviarPedidoFoody(payloadFoody);

    console.log('✅ Pedido processado com sucesso!');
    res.status(200).send('Pedido processado com sucesso.');

  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).send('Erro ao processar pedido.');
  }
});

router.post('/bling/status', async (req, res) => {
  const { orderId, status } = req.body;

  console.log('🔔 Atualização de status recebida do Bling:', req.body);

  if (!orderId || !status) {
    console.error('❌ Dados de status do Bling incompletos.');
    return res.status(400).send('Dados do status inválidos.');
  }

  try {
    await atualizarStatusPedidoFoody(orderId, status);
    res.status(200).send('Status enviado para Foody.');
  } catch (error) {
    console.error('❌ Erro ao enviar status para a Foody:', error.message);
    res.status(500).send('Erro ao processar atualização de status.');
  }
});

module.exports = router;
