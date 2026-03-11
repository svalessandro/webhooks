const fs = require('fs');
const path = require('path');
const logger = require('../logger');

const MAP_FILE = path.resolve(__dirname, '../../foody_bling_map.json');

// Carrega o mapeamento do arquivo se existir
let map = {};

if (fs.existsSync(MAP_FILE)) {
  try {
    map = JSON.parse(fs.readFileSync(MAP_FILE));
  } catch (e) {
    logger.error({ error: e }, 'Erro ao ler o arquivo de mapeamento');
  }
}

function salvarRelacionamentoFoody(uidFoody, idPedidoBling) {
  map[uidFoody] = idPedidoBling;

  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2));
}

function obterPedidoBling(uidFoody) {
  return map[uidFoody];
}

module.exports = { salvarRelacionamentoFoody, obterPedidoBling };