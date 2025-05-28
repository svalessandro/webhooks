const express = require('express');
const router = express.Router();
const { obterPedidoBling, obterContatoBling } = require('../services/blingService');
const { enviarPedidoFoody } = require('../services/foodyService');

router.post('/bling', async (req, res) => {
  const pedidoBling = req.body.data;

  console.log('📦 Webhook recebido do Bling:', pedidoBling);

  try {
    const pedidoDetalhado = await obterPedidoBling(pedidoBling.id);
    const contatoDetalhado = await obterContatoBling(pedidoBling.contato.id);

    const payloadFoody = transformarPedidoParaOpenDelivery(pedidoDetalhado, contatoDetalhado);

    await enviarPedidoFoody(payloadFoody);

    res.status(200).send('Pedido processado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).send('Erro ao processar pedido');
  }
});

function transformarPedidoParaOpenDelivery(pedido, contato) {
  return {
    orderId: pedido.numero.toString(),
    orderDisplayId: pedido.numero.toString(),
    merchant: {
      id: "12345678900000-fake-uuid", // Ajustar para real se tiver
      name: "Minha Empresa"
    },
    customer: {
      name: contato.nome,
      phone: contato.telefone
    },
    items: pedido.itens.map(item => ({
      name: item.descricao,
      quantity: item.quantidade,
      price: item.valor
    })),
    deliveryAddress: {
      country: "BR",
      state: pedido.endereco.estado,
      city: pedido.endereco.cidade,
      district: pedido.endereco.bairro,
      street: pedido.endereco.logradouro,
      number: pedido.endereco.numero,
      postalCode: pedido.endereco.cep,
      complement: pedido.endereco.complemento,
      reference: "Ponto de referência",
      latitude: -23.55052, 
      longitude: -46.63331,
      instructions: "Deixar na portaria"
    },
    pickupAddress: {
      country: "BR",
      state: "SP",
      city: "São Paulo",
      district: "Empresa",
      street: "Rua da Empresa",
      number: "456",
      postalCode: "00000-000",
      complement: "Sala 2",
      reference: "Prédio azul",
      latitude: -23.55,
      longitude: -46.63,
      pickupLocation: "Recepção",
      parkingSpace: true,
      instructions: "Entrada lateral"
    },
    notifyPickup: true,
    notifyConclusion: true,
    returnToMerchant: true,
    canCombine: true,
    customerName: contato.nome,
    vehicle: {
      type: ["MOTORBIKE_BAG"],
      container: "NORMAL",
      containerSize: "SMALL",
      instruction: "Cuidado com o frágil"
    },
    limitTimes: {
      pickupLimit: 30,
      deliveryLimit: 60,
      orderCreatedAt: new Date().toISOString()
    },
    totalOrderPrice: { value: pedido.total, currency: "BRL" },
    orderDeliveryFee: { value: 10, currency: "BRL" },
    totalWeight: 1,
    packageVolume: 1,
    packageQuantity: 1,
    specialInstructions: "Manter na vertical",
    payments: {
      method: "OFFLINE",
      wirelessPos: true,
      offlineMethod: [{
        type: "CREDIT",
        amount: { value: pedido.total, currency: "BRL" }
      }],
      change: { value: 0, currency: "BRL" }
    },
    combinedOrdersIds: [],
    sourceAppId: "BlingIntegration",
    sourceOrderId: pedido.id.toString()
  };
}

module.exports = router;
