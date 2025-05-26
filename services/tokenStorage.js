const fs = require('fs');
const path = require('path');

const tokenFilePath = path.join(__dirname, '..', 'tokens.json');

function salvarTokens(tokens) {
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokens, null, 2));
  console.log('💾 Tokens salvos com sucesso em tokens.json');
}

function carregarTokens() {
  if (!fs.existsSync(tokenFilePath)) {
    console.log('⚠️ Arquivo de tokens não encontrado.');
    return null;
  }
  
  const data = fs.readFileSync(tokenFilePath);
  return JSON.parse(data);
}

module.exports = {
  salvarTokens,
  carregarTokens
};
