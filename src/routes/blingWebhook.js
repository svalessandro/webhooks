const express = require('express');
const router = express.Router();

const { consultarPedidoBling, consultarContatoPorId } = require('../services/blingApiService');
const { enviarPedidoFoody } = require('../services/foodyService');

router.post('/bling', async (req, res) => {
  const pedidoBling = req.body;

  console.log('📦 Webhook recebido do Bling:', pedidoBling);

  try {
    const pedidoDetalhado = await consultarPedidoBling(pedidoBling.id);
    const contatoDetalhado = await consultarContatoPorId(pedidoBling.contato.id);

    const payload = transformarPedidoParaOpenDelivery(pedidoDetalhado, contatoDetalhado);

    await enviarPedidoFoody(payload);

    res.status(200).send('Pedido processado com sucesso.');

  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).send('Erro ao processar pedido.');
  }
});

function transformarPedidoParaOpenDelivery(pedidoBling, contatoBling) {
  return {
    orderId: pedidoBling.numero.toString(),
    orderDisplayId: pedidoBling.numero.toString(),
    merchant: {
      id: "12345678901234-merchantIdExemplo",
      name: "Empresa Exemplo"
    },
    customer: {
      name: contatoBling.nome || "Cliente Exemplo",
      phone: contatoBling.fone || "+5511999999999"
    },
    items: pedidoBling.itens.map(item => ({
      name: item.descricao,
      quantity: item.quantidade,
      price: item.valor
    })),
    deliveryAddress: {
      country: "BR",
      state: contatoBling.estado || "SP",
      city: contatoBling.cidade || "São Paulo",
      district: contatoBling.bairro || "Centro",
      street: contatoBling.endereco || "Rua Exemplo",
      number: contatoBling.numero || "123",
      postalCode: contatoBling.cep || "00000-000",
      complement: contatoBling.complemento || "",
      reference: contatoBling.referencia || "",
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
    customerName: contatoBling.nome || "Cliente Exemplo",
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
    totalOrderPrice: { value: pedidoBling.total, currency: "BRL" },
    orderDeliveryFee: { value: 10, currency: "BRL" },
    totalWeight: 1,
    packageVolume: 1,
    packageQuantity: pedidoBling.itens.length,
    specialInstructions: "Manter na vertical",
    payments: {
      method: "OFFLINE",
      wirelessPos: true,
      offlineMethod: [
        {
          type: "CREDIT",
          amount: { value: pedidoBling.total, currency: "BRL" }
        }
      ],
      change: { value: 0, currency: "BRL" }
    },
    combinedOrdersIds: [],
    sourceAppId: "BlingIntegration",
    sourceOrderId: pedidoBling.id.toString()
  };
}

module.exports = router;
