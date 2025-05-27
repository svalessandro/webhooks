const axios = require('axios');

const FOODY_URL = process.env.FOODY_OPEN_DELIVERY_URL; // já é https://app.foodydelivery.com/opendelivery/api
const FOODY_CLIENT_ID = process.env.FOODY_CLIENT_ID;
const FOODY_CLIENT_SECRET = process.env.FOODY_CLIENT_SECRET;

async function enviarPedidoFoody(pedidoBling) {
  const payload = transformarPedidoParaOpenDelivery(pedidoBling);

  console.log('🚀 Enviando pedido para Foody Open Delivery:', payload);

  const response = await axios.post(
    `${FOODY_URL}/v1/orders`,
    payload,
    {
      headers: {
        'client-id': FOODY_CLIENT_ID,
        'client-secret': FOODY_CLIENT_SECRET,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('✅ Pedido enviado com sucesso:', response.data);
}

function transformarPedidoParaOpenDelivery(pedidoBling) {
  return {
    orderId: pedidoBling.data.numero.toString(),
    status: "PLACED",
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
      street: "Rua Exemplo",
      number: "123",
      city: "São Paulo",
      state: "SP",
      country: "BR",
      postalCode: "00000-000"
    }
  };
}

module.exports = { enviarPedidoFoody };
