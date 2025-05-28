const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');

const BLING_API_URL = process.env.BLING_API_URL;

async function obterDetalhesPedidoBling(pedidoId) {
  const token = await getBlingAccessToken();

  try {
    const response = await axios.get(
      `${BLING_API_URL}/pedidos/${pedidoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('✅ Detalhes do pedido obtidos:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Erro ao obter detalhes do pedido:', error.response?.data || error.message);
    throw new Error('Falha ao obter detalhes do pedido Bling');
  }
}

module.exports = { obterDetalhesPedidoBling };
