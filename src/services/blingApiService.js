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

 codex/add-atualizarstatuspedidobling-and-atualizarstatuspedidofood
 codex/add-atualizarstatuspedidobling-and-atualizarstatuspedidofood
 {

codex/implement-foody-and-bling-webhook-endpoints
async function atualizarStatusPedidoBling(orderId, status) {
  const token = await getBlingAccessToken();

  try {
    const response = await axios.patch(
      `${BLING_API_BASE_URL}/pedidos/vendas/${orderId}`,
      { situacao: status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('✅ Status do pedido atualizado no Bling:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      '❌ Erro ao atualizar status no Bling:',
      error.response?.data || error.message
    );
    throw new Error('Falha ao atualizar status no Bling');
  }
}

module.exports = {
  consultarPedidoBling,
  consultarContatoBling,
  atualizarStatusPedidoBling
};

 main
async function atualizarSituacaoPedidoBling(pedidoId, situacaoId) {
 main
  const token = await getBlingAccessToken();

  const response = await axios.post(
    `${BLING_API_BASE_URL}/pedidos/vendas/${pedidoId}/situacoes`,
 codex/add-atualizarstatuspedidobling-and-atualizarstatuspedidofood
    { situacao: status },
    { idSituacao: situacaoId },
 main
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

 codex/add-atualizarstatuspedidobling-and-atualizarstatuspedidofood
 codex/add-atualizarstatuspedidobling-and-atualizarstatuspedidofood
module.exports = { consultarPedidoBling, consultarContatoBling, atualizarStatusPedidoBling };


module.exports = { consultarPedidoBling, consultarContatoBling, atualizarSituacaoPedidoBling };
 main
main
