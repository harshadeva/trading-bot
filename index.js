const { monitorMarket } = require('./services/monitor');
const { logMessage } = require('./utils/logger');
const { adjustQuantity } = require('./utils/calculations');

(async () => {
  try {
    const symbol = 'BTCUSDT'; // Trading pair
    const buyThreshold = 93600; // Buy when price lower than this
    const sellThreshold = 93620; // Sell when price higher than this
    const buyingDolors = 10; // Amount to buy
    const quantity = await adjustQuantity(Number((buyingDolors / buyThreshold).toFixed(8)), symbol);

    logMessage('Starting trading bot with Binance Testnet...');
    await monitorMarket(symbol, buyThreshold, sellThreshold, quantity);
  } catch (error) {
    console.error('Error starting bot:', error.message);
  }
})();




