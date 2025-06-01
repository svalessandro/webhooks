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
    // Consulta detalhada no Bling
    const pedidoDetalhado = await consultarPedidoBling(pedidoBling.id, pedidoBling.numero);

    // Monta o payload para o Foody
    const pedidoFoody = {
      orderId: pedidoDetalhado.data.id,
      cliente: {
        nome: pedidoDetalhado.data.contato?.nome || 'Sem nome',
        cpf: pedidoDetalhado.data.contato?.numeroDocumento || '',
        endereco: pedidoDetalhado.data.transporte?.etiqueta?.endereco || 'Sem endereço'
      },
      produtos: (pedidoDetalhado.data.itens || []).map(item => ({
        descricao: item.descricao,
        quantidade: item.quantidade,
        preco: item.valor
      }))
    };

    // Envia para o Foody
    await enviarPedidoFoody(pedidoFoody);

    console.log('✅ Pedido processado com sucesso!');
    res.status(200).send('Pedido processado com sucesso.');

  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).send('Erro ao processar pedido.');
  }
});

module.exports = router;
