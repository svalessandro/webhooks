const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');
const logger = require('../logger');

const BLING_API_BASE_URL =
  process.env.BLING_API_BASE_URL || 'https://api.bling.com.br/Api/v3';

async function consultarPedidoBling(pedidoId) {
  const token = await getBlingAccessToken();

  try {
    logger.info({ pedidoId }, 'Consultando pedido no Bling');

    const response = await axios.get(
      `${BLING_API_BASE_URL}/pedidos/vendas/${pedidoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;

  } catch (error) {

    logger.error(
      {
        pedidoId,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      },
      'Erro ao consultar pedido no Bling'
    );

    throw error;
  }
}

async function consultarContatoBling(contatoId) {
  const token = await getBlingAccessToken();

  try {

    logger.info({ contatoId }, 'Consultando contato no Bling');

    const response = await axios.get(
      `${BLING_API_BASE_URL}/contatos/${contatoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;

  } catch (error) {

    logger.error(
      {
        contatoId,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      },
      'Erro ao consultar contato no Bling'
    );

    throw error;
  }
}

module.exports = { consultarPedidoBling, consultarContatoBling };