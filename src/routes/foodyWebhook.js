const express = require('express');
const { atualizarStatusPedidoBling } = require('../services/blingApiService');
const router = express.Router();
const { atualizarSituacaoPedidoBling } = require('../services/blingApiService');

router.post('/', async (req, res) => {
 codex/implement-foody-and-bling-webhook-endpoints
  const { orderId, status } = req.body;
  const webhookData = req.body;
  main

  console.log('📡 Webhook recebido da Foody:', JSON.stringify(req.body, null, 2));

 codex/implement-foody-and-bling-webhook-endpoints
  if (!orderId || !status) {
    console.error('❌ Payload da Foody incompleto.');
    return res.status(400).send('Dados inválidos.');
  }

  try {
    await atualizarStatusPedidoBling(orderId, status);
    res.status(200).send('Status enviado ao Bling.');
  } catch (error) {
    console.error('❌ Erro ao atualizar status no Bling:', error.message);

  try {
    const orderId = webhookData?.orderId || webhookData?.order?.id;
    const statusId = webhookData?.statusId || webhookData?.status;

    if (!orderId || !statusId) {
      return res.status(400).send('Dados do webhook inválidos.');
    }

    console.log(`🚀 Atualizando status do pedido ${orderId} para ${statusId} no Bling`);
    await atualizarSituacaoPedidoBling(orderId, statusId);

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Erro ao processar webhook da Foody:', error.message);
 main
    res.status(500).send('Erro ao processar webhook.');
  }
});

module.exports = router;
