const transformarPedidoParaOpenDelivery = (pedido) => {
  const etiqueta = pedido.transporte?.etiqueta || {};

  return {
    orderId: pedido.id.toString(),
    orderDisplayId: pedido.numero.toString(),
    sourceOrderId: pedido.id.toString(),
    sourceAppId: 'BlingIntegration',
    merchant: {
      id: '00000000000000-teste',
      name: 'Minha Empresa'
    },
    customer: {
      name: pedido.contato?.nome || 'Cliente não identificado',
      phone: '+550000000000' // Substituir se possível
    },
    customerName: pedido.contato?.nome || 'Cliente não identificado',
    items: (pedido.itens || []).map(item => ({
      name: item.descricao,
      quantity: item.quantidade,
      price: item.valor
    })),
    deliveryAddress: {
      country: 'BR',
      state: etiqueta.uf || '',
      city: etiqueta.municipio || '',
      district: etiqueta.bairro || '',
      street: etiqueta.endereco || '',
      number: etiqueta.numero || '',
      postalCode: etiqueta.cep || '',
      complement: etiqueta.complemento || '',
      reference: etiqueta.referencia || '',
      latitude: -23.55052,
      longitude: -46.63331,
      instructions: 'Deixar na portaria'
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
