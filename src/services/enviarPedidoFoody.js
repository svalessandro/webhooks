const axios = require('axios');

async function enviarPedidoFoody(pedido, foodyToken) {
  try {
    const response = await axios.post(
      'https://app.foodydelivery.com/rest/1.2/orders',
      pedido,
      {
        headers: {
          'Authorization': foodyToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    );

    console.log('✅ Pedido enviado para Foody com sucesso:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Erro ao enviar pedido para Foody:', {
      message: error.message,
      data: error.response?.data
    });
    throw error;
  }
}

module.exports = { enviarPedidoFoody };
