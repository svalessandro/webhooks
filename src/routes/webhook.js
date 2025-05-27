const express = require('express');
const router = express.Router();
const { enviarPedidoFoody } = require('../services/enviarPedidoFoody');

const FOODY_TOKEN = process.env.FOODY_TOKEN || 'SEU_TOKEN_AQUI';

router.post('/', async (req, res) => {
  console.log('📦 Webhook recebido do Bling:', JSON.stringify(req.body, null, 2));

  try {
    console.log('🛠️ Transformando pedido para Foody...');
    const pedidoBling = req.body;
    const pedidoFoody = transformarPedidoBlingParaFoody(pedidoBling);
    console.log('🚀 Enviando pedido para Foody:', JSON.stringify(pedidoFoody, null, 2));

    const resultado = await enviarPedidoFoody(pedidoFoody, FOODY_TOKEN);
    console.log('✅ Resultado do envio:', resultado);

    res.status(200).send('Pedido processado e enviado para Foody com sucesso.');

  } catch (error) {
    console.error('❌ Erro ao processar pedido:', {
      message: error.message,
      data: error.response?.data
    });
    res.status(500).send('Erro ao processar pedido do Bling.');
  }
});

function transformarPedidoBlingParaFoody(pedidoBling) {
  return {
    id: pedidoBling.data.numero.toString(),
    status: 'open',
    deliveryFee: 5.0,  // Ajuste conforme sua regra de negócio
    paymentMethod: 'money',
    notes: 'sem observações',
    courierFee: 4.0,
    orderTotal: pedidoBling.data.total,
    orderDetails: '1x Produto exemplo',
    deliveryPoint: {
      address: 'Rua Exemplo, 123',
      street: 'Rua Exemplo',
      houseNumber: '123',
      postalCode: '00000-000',
      coordinates: {
        lat: -23.000000,
        lng: -46.000000
      },
      city: 'São Paulo',
      region: 'SP',
      country: 'BR',
      complement: 'Apto 1'
    },
    customer: {
      customerPhone: '+5511999999999',
      customerName: 'Cliente Exemplo',
      customerEmail: 'cliente@exemplo.com'
    },
    date: new Date().toISOString()
  };
}

module.exports = router;
