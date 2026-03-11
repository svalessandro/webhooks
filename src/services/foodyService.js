const axios = require('axios');
const { getAccessToken } = require('./authService');
const { salvarRelacionamentoFoody } = require('./foodyBlingMap');
const logger = require('../logger');

const FOODY_URL = process.env.FOODY_OPEN_DELIVERY_URL;

async function enviarPedidoFoody(payload) {
  const token = await getAccessToken();

  logger.info({ payload }, 'Enviando pedido para Foody Open Delivery');

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

      logger.info(
        { deliveryId, orderId: payload.orderId },
        'Mapeamento salvo'
      );
    }

    logger.info({ response: response.data }, 'Pedido enviado com sucesso');

  } catch (error) {

    logger.error(
      {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
        message: error.message
      },
      'Erro ao processar pedido'
    );

  }
}

module.exports = { enviarPedidoFoody };