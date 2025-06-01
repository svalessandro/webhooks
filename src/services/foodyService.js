const axios = require('axios');
const { getAccessToken } = require('./authService');

const FOODY_URL = process.env.FOODY_OPEN_DELIVERY_URL;

async function enviarPedidoFoody(pedido) {
  const token = await getAccessToken();

  const payload = {
    orderId: pedido.id,
    orderDisplayId: pedido.numero, // ✅ Campo obrigatório para o Foody
    cliente: {
      nome: pedido.contato?.nome || 'Sem nome',
      cpf: pedido.contato?.numeroDocumento || '',
      endereco: pedido.transporte?.etiqueta?.endereco || 'Sem endereço'
    },
    produtos: (pedido.itens || []).map(item => ({
      descricao: item.descricao,
      quantidade: item.quantidade,
      preco: item.valor
    }))
  };

  console.log('🚀 Enviando pedido para Foody Open Delivery:', payload);

  try {
    const response = await axios.post(
      `${FOODY_URL}/logistics/delivery`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Pedido enviado com sucesso:', response.data);
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', {
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
      message: error.message
    });
  }
}

module.exports = { enviarPedidoFoody };
