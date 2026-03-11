const logger = require('../logger');

function errorHandler(err, req, res, next) {

  logger.error(
    {
      message: err.message,
      stack: err.stack
    },
    'Erro não tratado'
  );

  res.status(500).json({
    error: 'Internal server error'
  });

}

module.exports = errorHandler;