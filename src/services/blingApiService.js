const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');

const BLING_API_BASE_URL = process.env.BLING_API_BASE_URL;

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

async function consultarContatoPorId(contatoId) {
  const token = await getBlingAccessToken();

  try {
    const response = await axios.get(
      `${BLING_API_BASE_URL}/contatos/${contatoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('✅ Contato detalhado consultado no Bling:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Erro ao consultar contato no Bling:', error.response?.data || error.message);
    throw new Error('Falha ao consultar contato no Bling');
  }
}

module.exports = { consultarPedidoBling, consultarContatoPorId };
