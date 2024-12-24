const { signQuery,axiosInstance } = require('./config/binance');
const { getMarketPrice } = require('./services/market');
const { monitorMarket } = require('./services/monitor');
const { placeSellOrder } = require('./services/order');
const { logMessage } = require('./utils/logger');

(async () => {
  try {
  
    const symbol = 'BTCUSDT'; // Trading pair
    const investingAmount = 10; // Amount to buy

    logMessage('Starting trading bot with Binance Testnet...');
    await monitorMarket(symbol,investingAmount);
  } catch (error) {
    console.error('Error starting bot:', error.message);
  }
})();



