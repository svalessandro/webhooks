const axios = require('axios');
const { getAccessToken } = require('./authService');

const FOODY_URL = process.env.FOODY_OPEN_DELIVERY_URL;

async function enviarPedidoFoody(pedidoBling) {
  const payload = transformarPedidoParaOpenDelivery(pedidoBling);

  console.log('🚀 Enviando pedido para Foody Open Delivery:', payload);

  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `${FOODY_URL}/logistics/delivery`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
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
    merchant: {
      id: "41356153000153",  // Substituir se necessário
      name: "Inlar Imoveis LTDA"
    },
    pickupAddress: {
      country: "BR",
      state: "SP",
      city: "São Paulo",
      district: "Centro",
      street: "Rua Exemplo",
      number: "100",
      postalCode: "00000-000",
      complement: "Sala 1",
      reference: "Próximo ao metrô",
      latitude: -23.55052,
      longitude: -46.633308,
      parkingSpace: true
    },
    notifyPickup: true,
    notifyConclusion: true,
    returnToMerchant: true,
    canCombine: true,
    deliveryAddress: {
      country: "BR",
      state: "SP",
      city: "São Paulo",
      district: "Centro",
      street: "Rua Exemplo",
      number: "200",
      postalCode: "00000-000",
      complement: "Apto 2",
      reference: "Em frente ao shopping",
      latitude: -23.55052,
      longitude: -46.633308
    },
    customerName: "Cliente Exemplo",
    vehicle: {
      type: ["MOTORBIKE_BAG"],
      container: "NORMAL",
      containerSize: "SMALL",
      instruction: "Manusear com cuidado"
    },
    limitTimes: {
      pickupLimit: 30,
      deliveryLimit: 60,
      orderCreatedAt: new Date().toISOString()
    },
    totalOrderPrice: {
      value: pedidoBling.data.total,
      currency: "BRL"
    },
    orderDeliveryFee: {
      value: 10.0,
      currency: "BRL"
    },
    totalWeight: 1.0,
    packageVolume: 1.0,
    packageQuantity: 1,
    specialInstructions: "Entregar ao porteiro",
    additionalPricePercentual: 0.1,
    payments: {
      method: "OFFLINE",
      wirelessPos: true,
      offlineMethod: [
        {
          type: "CREDIT",
          amount: {
            value: pedidoBling.data.total,
            currency: "BRL"
          }
        }
      ],
      change: {
        value: 0,
        currency: "BRL"
      }
    },
    combinedOrdersIds: [],
    sourceAppId: "bling-foody-integration",
    sourceOrderId: pedidoBling.data.id.toString()
  };
}

module.exports = { enviarPedidoFoody };
