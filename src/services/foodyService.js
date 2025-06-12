const axios = require('axios');
const { getAccessToken } = require('./authService');

const FOODY_URL = process.env.FOODY_OPEN_DELIVERY_URL;

async function enviarPedidoFoody(payload) {
  const token = await getAccessToken();

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

async function atualizarStatusPedidoFoody(orderId, status) {
  const token = await getAccessToken();

  try {
 codex/add-atualizarstatuspedidobling-and-atualizarstatuspedidofood
    const response = await axios.put(

    const response = await axios.post(
 main
      `${FOODY_URL}/logistics/delivery/${orderId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

 codex/add-atualizarstatuspedidobling-and-atualizarstatuspedidofood
    console.log('✅ Status do pedido atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar status do pedido:', {

    console.log('✅ Status do pedido atualizado na Foody:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar status na Foody:', {
 main
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
      message: error.message
    });
 codex/add-atualizarstatuspedidobling-and-atualizarstatuspedidofood

    throw new Error('Falha ao atualizar status na Foody');
 main
  }
}

module.exports = { enviarPedidoFoody, atualizarStatusPedidoFoody };
