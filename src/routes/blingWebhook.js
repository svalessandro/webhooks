const express = require('express');
const router = express.Router();

const { consultarContatoPorId, consultarPedidoPorId } = require('../services/blingApiService');
const { enviarPedidoFoody } = require('../services/foodyService');

router.post('/bling', async (req, res) => {
  const pedidoBling = req.body.data;

  console.log('📦 Webhook recebido do Bling:', pedidoBling);

  try {
    // Consulta detalhes do contato
    const contato = await consultarContatoPorId(pedidoBling.contato.id);

    // Consulta detalhes do pedido
    const pedido = await consultarPedidoPorId(pedidoBling.id);

    // Monta payload para o Foody com os dados reais
    const payload = {
      orderId: pedidoBling.numero.toString(),
      orderDisplayId: pedidoBling.numero.toString(),
      merchant: {
        id: "12345678901234-abcdefg",  // Coloque o CNPJ + UUID se tiver, senão mantenha fictício.
        name: "Minha Empresa"
      },
      customer: {
        name: contato.nome,
        phone: contato.contatos[0]?.numero || "Sem telefone"
      },
      items: pedido.itens.map(item => ({
        name: item.descricao,
        quantity: item.quantidade,
        price: item.valor
      })),
      deliveryAddress: {
        country: "BR",
        state: contato.endereco?.uf || "SP",
        city: contato.endereco?.cidade || "São Paulo",
        district: contato.endereco?.bairro || "Centro",
        street: contato.endereco?.logradouro || "Sem rua",
        number: contato.endereco?.numero || "S/N",
        postalCode: contato.endereco?.cep || "00000-000",
        complement: contato.endereco?.complemento || "",
        reference: "Referência",
        latitude: -23.55052, // Pode deixar fixo ou buscar se tiver no cadastro
        longitude: -46.63331,
        instructions: "Deixar na portaria"
      },
      pickupAddress: {
        country: "BR",
        state: "SP",
        city: "São Paulo",
        district: "Empresa",
        street: "Rua da Empresa",
        number: "456",
        postalCode: "00000-000",
        complement: "Sala 2",
        reference: "Prédio azul",
        latitude: -23.55,
        longitude: -46.63,
        pickupLocation: "Recepção",
        parkingSpace: true,
        instructions: "Entrada lateral"
      },
      notifyPickup: true,
      notifyConclusion: true,
      returnToMerchant: true,
      canCombine: true,
      customerName: contato.nome,
      vehicle: {
        type: ["MOTORBIKE_BAG"],
        container: "NORMAL",
        containerSize: "SMALL",
        instruction: "Cuidado com o frágil"
      },
      limitTimes: {
        pickupLimit: 30,
        deliveryLimit: 60,
        orderCreatedAt: new Date().toISOString()
      },
      totalOrderPrice: { value: pedidoBling.total, currency: "BRL" },
      orderDeliveryFee: { value: 10, currency: "BRL" },
      totalWeight: 1,
      packageVolume: 1,
      packageQuantity: 1,
      specialInstructions: "Manter na vertical",
      payments: {
        method: pedido.formaPagamento?.descricao || "OFFLINE",
        wirelessPos: true,
        offlineMethod: [
          {
            type: "CREDIT",
            amount: { value: pedidoBling.total, currency: "BRL" }
          }
        ],
        change: { value: 0, currency: "BRL" }
      },
      combinedOrdersIds: [],
      sourceAppId: "BlingIntegration",
      sourceOrderId: pedidoBling.id.toString()
    };

    // Envia para Foody
    await enviarPedidoFoody(payload);

    res.status(200).send('Pedido processado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error.message);
    res.status(500).send('Erro ao processar pedido.');
  }
});

module.exports = router;
