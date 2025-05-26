const axios = require('axios');

async function cadastrarWebhook(accessToken, evento, url) {
  try {
    const response = await axios.post(
      'https://www.bling.com.br/Api/v3/webhooks',
      {
        event: evento,
        url: url
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Webhook ${evento} criado com sucesso!`, response.data);
  } catch (error) {
    console.error(`❌ Erro ao criar webhook ${evento}:`, {
      message: error.message,
      data: error.response?.data
    });
  }
}

module.exports = { cadastrarWebhook };
