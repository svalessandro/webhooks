const axios = require('axios');
const logger = require('../logger');

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

    logger.warn({ endereco }, 'Nenhuma coordenada encontrada para o endereço');

    return null;

  } catch (error) {

    logger.error(
      { message: error.message },
      'Erro ao obter coordenadas'
    );

    return null;
  }
}

module.exports = { obterCoordenadasPorEndereco };
