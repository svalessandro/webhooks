// src/utils/geocodificador.js
const axios = require('axios');

async function obterCoordenadasPorEndereco(endereco) {
  const url = `https://nominatim.openstreetmap.org/search`;

  try {
    const response = await axios.get(url, {
      params: {
        q: endereco,
        format: 'json',
        addressdetails: 1,
        limit: 1
      },
      headers: {
        'User-Agent': 'bling-foody-integration'
      }
    });

    const local = response.data?.[0];

    if (local) {
      return {
        latitude: parseFloat(local.lat),
        longitude: parseFloat(local.lon)
      };
    }

    console.warn('⚠️ Nenhuma coordenada encontrada para o endereço:', endereco);
    return null;

  } catch (error) {
    console.error('❌ Erro ao obter coordenadas:', error.message);
    return null;
  }
}

module.exports = { obterCoordenadasPorEndereco };
