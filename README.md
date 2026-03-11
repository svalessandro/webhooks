Bling + Foody Integration Service

Serviço backend desenvolvido em Node.js responsável pela integração entre o ERP Bling e a plataforma Foody Delivery, utilizando webhooks e APIs REST para sincronização de pedidos e status.

Arquitetura
Bling Webhook
      ↓
API Node.js
      ↓
Consulta pedido na API Bling
      ↓
Transformação do payload
      ↓
Envio para API Foody
      ↓
Mapeamento de IDs
      ↓
Webhook Foody → Atualização de status no Bling
Tecnologias

Node.js

Express

Axios

OAuth2

Webhooks

OpenStreetMap (Nominatim)

Estrutura do projeto
src
 ├ routes
 ├ services
 ├ utils
 └ app.js
Como executar
npm install
npm start
Variáveis de ambiente
BLING_CLIENT_ID=
BLING_CLIENT_SECRET=
BLING_REFRESH_TOKEN=

FOODY_CLIENT_ID=
FOODY_CLIENT_SECRET=
FOODY_TOKEN_URL=
FOODY_OPEN_DELIVERY_URL=
