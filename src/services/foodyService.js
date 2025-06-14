const axios = require('axios');
const { getAccessToken } = require('./authService');
const { salvarRelacionamentoFoody } = require('./foodyBlingMap');

const FOODY_URL = process.env.FOODY_OPEN_DELIVERY_URL;

async function enviarPedidoFoody(payload) {
  const token = await getAccessToken();

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

    const deliveryId = response.data?.deliveryId;
    if (deliveryId) {
      salvarRelacionamentoFoody(deliveryId, payload.orderId);
      console.log(`🧩 Mapeamento salvo: ${deliveryId} -> ${payload.orderId}`);
    }

    console.log('✅ Pedido enviado com sucesso:', response.data);
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', {
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
      message: error.message
    });
  }
}

module.exports = { enviarPedidoFoody };
