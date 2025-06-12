const express = require('express');
const router = express.Router();
const { atualizarSituacaoPedidoBling } = require('../services/blingApiService');

router.post('/', async (req, res) => {
  const webhookData = req.body;

  console.log('📡 Webhook recebido da Foody:', JSON.stringify(webhookData, null, 2));

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
    res.status(500).send('Erro ao processar webhook.');
  }
});

module.exports = router;
