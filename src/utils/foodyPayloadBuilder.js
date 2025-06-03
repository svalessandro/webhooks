const { obterCoordenadasPorEndereco } = require('../utils/geocodificador');
const { consultarContatoBling } = require('../services/blingApiService'); // ou o nome do arquivo onde está a função

async function transformarPedidoParaOpenDelivery(pedido) {
  const contatoId = pedido.contato?.id;

  if (!contatoId) {
    throw new Error('ID do contato não encontrado no pedido.');
  }

  const contatoResponse = await consultarContatoBling(contatoId);
  const contato = contatoResponse?.data;

  const enderecoGeral = contato?.endereco?.geral;
  if (!enderecoGeral) {
    throw new Error('Endereço geral não encontrado para o contato.');
  }

  const enderecoTexto = `${enderecoGeral.endereco || ''}, ${enderecoGeral.numero || ''}, ${enderecoGeral.municipio || ''} - ${enderecoGeral.uf || ''}, ${enderecoGeral.cep || ''}`;
  const coords = await obterCoordenadasPorEndereco(enderecoTexto);

  return {
    orderId: pedido.id.toString(),
    orderDisplayId: pedido.numero.toString(),
    customerName: contato.nome || 'Nome não informado',
    customerPhoneLocalizer: contato.celular || "Telefone não informado",

    merchant: {
      id: "00000000000000-teste",
      name: "Minha Empresa"
    },

    customer: {
      name: contato.nome || 'Sem nome',
      phone: contato.customerPhoneLocalizer || '+550000000000'
    },

    items: (pedido.itens || []).map(item => ({
      name: item.descricao || 'Produto',
      quantity: item.quantidade || 1,
      price: item.valor || 0
    })),

    deliveryAddress: {
      street: enderecoGeral.endereco || '',
      number: enderecoGeral.numero || 'sem numero',
      district: enderecoGeral.bairro || '',
      city: enderecoGeral.municipio || '',
      state: enderecoGeral.uf || '',
      postalCode: enderecoGeral.cep || '',
      country: 'BR',
      complement: enderecoGeral.complemento || 'sem complemento',
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
      instructions: ''
    },

    notifyPickup: true,
    notifyConclusion: true,
    returnToMerchant: true,
    canCombine: true,

    vehicle: {
      type: ['MOTORBIKE_BAG'],
      container: 'NORMAL',
      containerSize: 'SMALL',
      instruction: ''
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
    items: (pedido.itens || []).map(item => ({
      name: item.descricao || 'Produto',
      quantity: item.quantidade || 1,
      price: item.valor || 0
    })),
    specialInstructions: '',

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
}

module.exports = { transformarPedidoParaOpenDelivery };
