const map = new Map();

function salvarRelacionamentoFoody(uidFoody, idPedidoBling) {
  map.set(uidFoody, idPedidoBling);
}

function obterPedidoBling(uidFoody) {
  return map.get(uidFoody);
}

module.exports = { salvarRelacionamentoFoody, obterPedidoBling };
