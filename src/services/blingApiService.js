const axios = require('axios');
const { getBlingAccessToken } = require('./blingAuthService');

const BLING_API_BASE_URL = process.env.BLING_API_BASE_URL || 'https://api.bling.com.br/Api/v3';

async function consultarPedidoBling(pedidoId, numeroPedido) {
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

    console.log('✅ Pedido detalhado consultado no Bling (por ID):', response.data);
    return response.data;

  } catch (error) {
    const errData = error.response?.data;
    console.error('⚠️ Erro ao consultar pedido por ID:', errData || error.message);

    if (errData?.error?.type === 'RESOURCE_NOT_FOUND') {
      console.log('🔄 Tentando consulta por número do pedido...');

      // Fallback para busca por número
      try {
        const searchResponse = await axios.get(
          `${BLING_API_BASE_URL}/pedidos`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
              numero: numeroPedido
            }
          }
        );

        const pedidos = searchResponse.data?.data;

        if (pedidos && pedidos.length > 0) {
          console.log('✅ Pedido encontrado via número:', pedidos[0]);
          return pedidos[0];
        } else {
          console.warn('⚠️ Nenhum pedido encontrado com esse número.');
          throw new Error('Pedido não encontrado pelo número');
        }
      } catch (searchError) {
        console.error('❌ Erro ao consultar pedido por número:', searchError.response?.data || searchError.message);
        throw new Error('Falha ao consultar pedido no Bling via número');
      }

    } else {
      throw new Error('Falha ao consultar pedido no Bling');
    }
  }
}

module.exports = { consultarPedidoBling };
