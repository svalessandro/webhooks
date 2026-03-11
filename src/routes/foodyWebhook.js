const express = require('express');
const router = express.Router();
const logger = require('../logger');

const { atualizarStatusPedidoBling } = require('../services/atualizarStatusBling');
const { obterPedidoBling } = require('../services/foodyBlingMap');

router.post('/', async (req, res) => {
  const { uid, status } = req.body;

  logger.info({ body: req.body }, 'Webhook recebido da Foody');

  if (!uid || !status) {
    logger.warn('Dados inválidos no webhook');
    return res.status(400).send('Dados inválidos no webhook');
  }

  const idPedidoBling = obterPedidoBling(uid);

  if (!idPedidoBling) {
    logger.warn(`Pedido Foody ${uid} não encontrado no mapeamento`);
    return res.status(404).send('Pedido não encontrado');
  }

  try {
    await atualizarStatusPedidoBling(idPedidoBling, status);

    logger.info(`Status sincronizado para pedido ${idPedidoBling}`);

    res.status(200).send('Status sincronizado com o Bling');

  } catch (error) {
    logger.error({ error }, 'Erro na sincronização com o Bling');
    res.status(500).send('Erro ao atualizar status no Bling');
  }
});

module.exports = router;