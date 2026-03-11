const express = require('express');
const router = express.Router();
const logger = require('../logger');

const { consultarPedidoBling } = require('../services/blingApiService');
const { enviarPedidoFoody } = require('../services/foodyService');
const { transformarPedidoParaOpenDelivery } = require('../utils/foodyPayloadBuilder');

router.post('/bling', async (req, res) => {
  const pedidoBling = req.body.data;

  logger.info({ pedidoBling }, 'Webhook recebido do Bling');

  if (!pedidoBling || !pedidoBling.id || !pedidoBling.numero) {
    logger.error('Pedido inválido ou incompleto.');
    return res.status(400).send('Dados do pedido inválidos.');
  }

  try {
    const pedidoDetalhado = await consultarPedidoBling(pedidoBling.id, pedidoBling.numero);
    const pedido = pedidoDetalhado?.data;

    if (!pedido || !pedido.id || !pedido.numero) {
      throw new Error('Pedido retornado do Bling está incompleto.');
    }

    const payloadFoody = await transformarPedidoParaOpenDelivery(pedido);

    logger.info({ payloadFoody }, 'Enviando pedido para Foody');

    await enviarPedidoFoody(payloadFoody);

    logger.info('Pedido processado com sucesso');

    res.status(200).send('Pedido processado com sucesso.');

  } catch (error) {
    logger.error({ error }, 'Erro ao processar pedido');
    res.status(500).send('Erro ao processar pedido.');
  }
});

module.exports = router;
