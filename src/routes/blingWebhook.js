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
        const pedidoDetalhado = await consultarPedidoBling(pedidoBling.id, pedidoBling.numero);
        const pedido = pedidoDetalhado?.data;

        if (!pedido || !pedido.id || !pedido.numero) {
          throw new Error('Pedido retornado do Bling está incompleto.');
        }

        await enviarPedidoFoody({
          orderId: pedido.id,
          orderDisplayId: pedido.numero,
          cliente: {
            nome: pedido.contato?.nome || 'Sem nome',
            cpf: pedido.contato?.numeroDocumento || '',
            endereco: pedido.transporte?.etiqueta?.endereco || 'Sem endereço'
          },
          produtos: (pedido.itens || []).map(item => ({
            descricao: item.descricao,
            quantidade: item.quantidade,
            preco: item.valor
          }))
        });


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
