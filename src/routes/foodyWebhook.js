const express = require('express');
const router = express.Router();
const { atualizarStatusPedidoBling } = require('../services/atualizarStatusBling');
const { obterPedidoBling } = require('../services/foodyBlingMap');

router.post('/', async (req, res) => {
  const { uid, status } = req.body;

  console.log('📡 Webhook recebido da Foody:', JSON.stringify(req.body, null, 2));

  if (!uid || !status) {
    return res.status(400).send('❌ Dados inválidos no webhook');
  }

  const idPedidoBling = obterPedidoBling(uid);

  if (!idPedidoBling) {
    console.warn(`⚠️ Pedido do Foody (${uid}) não encontrado no mapeamento.`);
    return res.status(404).send('❌ Pedido não encontrado');
  }

  try {
    await atualizarStatusPedidoBling(idPedidoBling, status);
    res.status(200).send('✅ Status sincronizado com o Bling');
  } catch (error) {
    console.error('❌ Erro na sincronização com o Bling:', error.message);
    res.status(500).send('Erro ao atualizar status no Bling');
  }
});

module.exports = router;
