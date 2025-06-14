const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');

const BLING_API_URL = 'https://api.bling.com.br/Api/v3';

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
    console.log(`🔁 Atualizando pedido ${idPedidoVenda} para situação ${idSituacao} no Bling`);

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

    console.log(`✅ Status do pedido ${idPedidoVenda} atualizado com sucesso para ${idSituacao}`);
  } catch (error) {
    console.error('❌ Erro ao atualizar status no Bling:', error.response?.data || error.message);
  }
}

module.exports = { atualizarStatusPedidoBling };
