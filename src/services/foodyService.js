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
  const endereco = pedidoBling.contato.endereco;

  return {
    orderId: pedidoBling.numero.toString(),
    orderDisplayId: pedidoBling.numero.toString(),

    merchant: {
      id: "12345678000199-fake", // pode deixar fixo por enquanto
      name: "Minha Empresa"
    },

    customer: {
      name: pedidoBling.contato.nome,
      phone: pedidoBling.contato.telefone
    },

    items: pedidoBling.itens.map(item => ({
      name: item.descricao,
      quantity: item.quantidade,
      price: item.valor
    })),

    deliveryAddress: {
      country: "BR",
      state: endereco.estado,
      city: endereco.cidade,
      district: endereco.bairro,
      street: endereco.rua,
      number: endereco.numero,
      postalCode: endereco.cep,
      complement: endereco.complemento,
      reference: endereco.referencia,
      latitude: -23.55052,  // opcional → se não tiver, deixar fixo
      longitude: -46.63331, // idem
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

    customerName: pedidoBling.contato.nome,

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
      method: pedidoBling.formaPagamento || "OFFLINE",
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

module.exports = { enviarPedidoFoody };
