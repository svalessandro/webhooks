const axios = require('axios');

const BLING_API_URL = 'https://api.bling.com.br/Api/v3';
const { getBlingAccessToken } = require('./blingAuthService');


const statusMap = {
  open: 6,
  onGoing: 15,
  delivered: 9,
  closed: 9,
  cancelled: 12
};

async function atualizarStatusPedidoBling(idPedidoVenda, statusFoody) {
  const idSituacao = statusMap[statusFoody];
  if (!idSituacao) {
    console.warn(`⚠️ Status desconhecido recebido da Foody: ${statusFoody}`);
    return;
  }

  const token = await getBlingAccessToken();

  try {
    const url = `${BLING_API_URL}/pedidos/vendas/${idPedidoVenda}/situacoes/${idSituacao}`;
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Status do pedido ${idPedidoVenda} atualizado para situação ${idSituacao} no Bling`);
  } catch (error) {
    console.error(`❌ Erro ao atualizar status no Bling:`, error.response?.data || error.message);
  }
}

module.exports = { atualizarStatusPedidoBling };
