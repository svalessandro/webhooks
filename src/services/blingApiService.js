const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');

const BLING_API_BASE_URL = process.env.BLING_API_BASE_URL || 'https://api.bling.com.br/Api/v3';

async function consultarPedidoBling(pedidoId) {
  const token = await getBlingAccessToken();

  try {
    const response = await axios.get(
      `${BLING_API_BASE_URL}/pedidos/${pedidoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('✅ Pedido detalhado consultado no Bling:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Erro ao consultar pedido no Bling:', error.response?.data || error.message);
    throw new Error('Falha ao consultar pedido no Bling');
  }
}

module.exports = { consultarPedidoBling };
