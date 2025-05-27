const axios = require('axios');
const { getAccessToken } = require('./authService');

const FOODY_URL = process.env.FOODY_OPEN_DELIVERY_URL;

async function enviarPedidoFoody(pedidoBling) {
  const token = await getAccessToken();
  const payload = transformarPedidoParaOpenDelivery(pedidoBling);

  console.log('🚀 Enviando pedido para Foody Open Delivery:', payload);

  try {
    const response = await axios.post(
      `${FOODY_URL}/logistics/delivery`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
    orderDisplayId: pedidoBling.data.numero.toString(),
    merchant: {
      id: '41356153000153',
      name: 'Inlar Imoveis LTDA'
    },
    pickupAddress: {
      country: 'BR',
      state: 'BR-SP',
      city: 'São Paulo',
      district: 'Centro',
      street: 'Rua da Empresa',
      number: '456',
      postalCode: '00000-000',
      complement: 'Sala 01',
      reference: 'Próximo ao metrô',
      latitude: -23.55052,
      longitude: -46.633308,
      pickupLocation: 'Recepção',
      parkingSpace: true,
      instructions: 'Retirar na recepção'
    },
    notifyPickup: true,
    notifyConclusion: true,
    returnToMerchant: true,
    canCombine: true,
    deliveryAddress: {
      country: 'BR',
      state: 'BR-SP',
      city: 'São Paulo',
      district: 'Centro',
      street: 'Rua Exemplo',
      number: '123',
      postalCode: '00000-000',
      complement: 'Apto 1',
      reference: 'Prédio Azul',
      latitude: -23.55052,
      longitude: -46.633308,
      instructions: 'Deixar com o porteiro'
    },
    customerName: 'Cliente Exemplo',
    vehicle: {
      type: ['MOTORBIKE_BAG'],
      container: 'NORMAL',
      containerSize: 'SMALL',
      instruction: 'Manter na posição vertical'
    },
    limitTimes: {
      pickupLimit: 30,
      deliveryLimit: 60,
      orderCreatedAt: new Date().toISOString()
    },
    totalOrderPrice: {
      value: pedidoBling.data.total,
      currency: 'BRL'
    },
    orderDeliveryFee: {
      value: 10.0,
      currency: 'BRL'
    },
    totalWeight: 1,
    packageVolume: 1,
    packageQuantity: 1,
    specialInstructions: 'Frágil, manusear com cuidado',
    additionalPricePercentual: 0.1,
    payments: {
      method: 'OFFLINE',
      wirelessPos: true,
      offlineMethod: [
        {
          type: 'CREDIT',
          amount: {
            value: pedidoBling.data.total,
            currency: 'BRL'
          }
        }
      ],
      change: {
        value: 0,
        currency: 'BRL'
      }
    },
    combinedOrdersIds: [],
    sourceAppId: 'SistemaIntegração',
    sourceOrderId: pedidoBling.data.id.toString()
  };
}

module.exports = { enviarPedidoFoody };
