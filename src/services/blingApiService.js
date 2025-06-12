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

async function atualizarSituacaoPedidoBling(pedidoId, situacaoId) {
  const token = await getBlingAccessToken();

  const response = await axios.post(
    `${BLING_API_BASE_URL}/pedidos/vendas/${pedidoId}/situacoes`,
    { idSituacao: situacaoId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

module.exports = { consultarPedidoBling, consultarContatoBling, atualizarSituacaoPedidoBling };
