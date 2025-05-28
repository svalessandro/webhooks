const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');

const BLING_API_URL = 'https://api.bling.com.br/Api/v3';

async function consultarContatoPorId(contatoId) {
  const token = await getBlingAccessToken();

  try {
    const response = await axios.get(
      `${BLING_API_URL}/contatos/${contatoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );

    console.log('✅ Contato retornado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao consultar contato:', error.response?.data || error.message);
    throw new Error('Falha ao consultar contato no Bling');
  }
}

async function consultarPedidoPorId(pedidoId) {
  const token = await getBlingAccessToken();

  try {
    const response = await axios.get(
      `${BLING_API_URL}/pedidos/${pedidoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );

    console.log('✅ Pedido retornado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao consultar pedido:', error.response?.data || error.message);
    throw new Error('Falha ao consultar pedido no Bling');
  }
}

module.exports = {
  consultarContatoPorId,
  consultarPedidoPorId
};
