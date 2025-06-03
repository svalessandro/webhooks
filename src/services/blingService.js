/** const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');

const BLING_API_URL = process.env.BLING_API_URL;

async function obterPedidoBling(pedidoId) {
  const token = await getBlingAccessToken();

  const response = await axios.get(
    `${BLING_API_URL}/pedidos/${pedidoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

async function obterContatoBling(contatoId) {
  const token = await getBlingAccessToken();

  const response = await axios.get(
    `${BLING_API_URL}/contatos/${contatoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

module.exports = { obterPedidoBling, obterContatoBling };
*/