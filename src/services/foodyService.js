const axios = require('axios');
const { getAccessToken } = require('./authService');

const FOODY_URL = process.env.FOODY_OPEN_DELIVERY_URL;

async function enviarPedidoFoody(pedidoBling) {
  const payload = transformarPedidoParaOpenDelivery(pedidoBling);

  console.log('🚀 Enviando pedido para Foody Open Delivery:', payload);

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${FOODY_URL}/logistics/delivery`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Pedido enviado com sucesso:', response.data);

  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.response?.data || error.message);
  }
}

function transformarPedidoParaOpenDelivery(pedidoBling) {
  return {
    orderId: pedidoBling.data.numero.toString(),
    customer: {
      name: "Cliente Exemplo",
      phone: "+5511999999999"
    },
    items: [
      {
        name: "Produto Exemplo",
        quantity: 1,
        price: pedidoBling.data.total
      }
    ],
    deliveryAddress: {
      country: "BR",
      state: "SP",
      city: "São Paulo",
      district: "Centro",
      street: "Rua Exemplo",
      number: "123",
      postalCode: "00000-000",
      complement: "Apto 1",
      reference: "Próximo à praça",
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
    customerName: "Cliente Exemplo",
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
    totalOrderPrice: { value: pedidoBling.data.total, currency: "BRL" },
    orderDeliveryFee: { value: 10, currency: "BRL" },
    totalWeight: 1,
    packageVolume: 1,
    packageQuantity: 1,
    specialInstructions: "Manter na vertical",
    additionalPricePercentual: 0.1,
    payments: {
      method: "OFFLINE",
      wirelessPos: true,
      offlineMethod: [
        {
          type: "CREDIT",
          amount: { value: pedidoBling.data.total, currency: "BRL" }
        }
      ],
      change: { value: 0, currency: "BRL" }
    },
    combinedOrdersIds: [],
    sourceAppId: "BlingIntegration",
    sourceOrderId: pedidoBling.data.id.toString()
  };
}

module.exports = { enviarPedidoFoody };
