const { obterCoordenadasPorEndereco } = require('../utils/geocodificador');

async function montarPayloadFoody(pedido) {
  const enderecoEntrega = pedido.transporte?.etiqueta;
  const enderecoTexto = `${enderecoEntrega?.endereco || ''}, ${enderecoEntrega?.numero || ''}, ${enderecoEntrega?.municipio || ''} - ${enderecoEntrega?.uf || ''}, ${enderecoEntrega?.cep || ''}`;

  const coords = await obterCoordenadasPorEndereco(enderecoTexto);

  return {
    orderId: pedido.id.toString(),
    orderDisplayId: pedido.numero.toString(),

    merchant: {
      id: "00000000000000-teste",
      name: "Minha Empresa"
    },

    customer: {
      name: pedido.contato?.nome || 'Sem nome',
      phone: '+550000000000'
    },

    items: (pedido.itens || []).map(item => ({
      name: item.descricao || 'Produto',
      quantity: item.quantidade || 1,
      price: item.valor || 0
    })),

    deliveryAddress: {
      street: enderecoEntrega?.endereco || '',
      number: enderecoEntrega?.numero || '',
      district: enderecoEntrega?.bairro || '',
      city: enderecoEntrega?.municipio || '',
      state: enderecoEntrega?.uf || '',
      postalCode: enderecoEntrega?.cep || '',
      country: 'BR',
      complement: enderecoEntrega?.complemento || '',
      reference: '',
      latitude: coords?.latitude || -23.55052,
      longitude: coords?.longitude || -46.63331,
      instructions: ''
    },
    pickupAddress: {
      country: 'BR',
      state: 'SP',
      city: 'São Paulo',
      district: 'Empresa',
      street: 'Rua da Empresa',
      number: '456',
      postalCode: '00000-000',
      complement: 'Sala 2',
      reference: 'Prédio azul',
      latitude: -23.55,
      longitude: -46.63,
      pickupLocation: 'Recepção',
      parkingSpace: true,
      instructions: 'Entrada lateral'
    },
    notifyPickup: true,
    notifyConclusion: true,
    returnToMerchant: true,
    canCombine: true,
    vehicle: {
      type: ['MOTORBIKE_BAG'],
      container: 'NORMAL',
      containerSize: 'SMALL',
      instruction: 'Cuidado com o frágil'
    },
    limitTimes: {
      pickupLimit: 30,
      deliveryLimit: 60,
      orderCreatedAt: new Date().toISOString()
    },
    totalOrderPrice: { value: pedido.total, currency: 'BRL' },
    orderDeliveryFee: { value: 10, currency: 'BRL' },
    totalWeight: 1,
    packageVolume: 1,
    packageQuantity: 1,
    specialInstructions: 'Manter na vertical',
    payments: {
      method: 'OFFLINE',
      wirelessPos: true,
      offlineMethod: [
        {
          type: 'CREDIT',
          amount: { value: pedido.total, currency: 'BRL' }
        }
      ],
      change: { value: 0, currency: 'BRL' }
    },
    combinedOrdersIds: []
  };
};

module.exports = { transformarPedidoParaOpenDelivery };
