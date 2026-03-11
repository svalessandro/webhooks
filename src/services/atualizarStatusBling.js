const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');
const logger = require('../logger');

const BLING_API_URL = 'https://api.bling.com.br/Api/v3';

const statusMap = {
  open: 6,
  accepted: 464346,
  onGoing: 15,
  delivered: 9,
  closed: 9,
  cancelled: 12
};

async function atualizarStatusPedidoBling(idPedidoVenda, statusFoody) {
  const idSituacao = statusMap[statusFoody];
  if (!idSituacao) {
    logger.warn(`Status desconhecido recebido da Foody: ${statusFoody}`);
    return;
  }

  const token = await getBlingAccessToken();

  try {
    const url = `${BLING_API_URL}/pedidos/vendas/${idPedidoVenda}/situacoes/${idSituacao}`;
    logger.info(`Atualizando pedido ${idPedidoVenda} para situação ${idSituacao} no Bling`);

    const response = await axios.patch(
      url,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    logger.info(`Status do pedido ${idPedidoVenda} atualizado com sucesso`);
  } catch (error) {

    logger.error(
      {
        idPedidoVenda,
        statusFoody,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      },
      'Erro ao atualizar status do pedido no Bling'
    );

  }
}

module.exports = { atualizarStatusPedidoBling };
