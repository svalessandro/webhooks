const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');

const BLING_API_BASE_URL = process.env.BLING_API_BASE_URL || 'https://api.bling.com.br/Api/v3';

async function consultarPedidoBling(pedidoId, numeroPedido) {
  const token = await getBlingAccessToken();
    
  const response = await axios.get(
      `${BLING_API_BASE_URL}/pedidos/vendas/${pedidoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

  return response.data;
}

async function consultarContatoBling(contatoId) {
  const token = await getBlingAccessToken();

  const response = await axios.get(
    `${BLING_API_BASE_URL}/contatos/${contatoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

module.exports = { consultarPedidoBling, consultarContatoBling };
