const { signQuery,axiosInstance } = require('./config/binance');
const { getMarketPrice } = require('./services/market');
const { monitorMarket } = require('./services/monitor');
const { placeSellOrder } = require('./services/order');
const { logMessage } = require('./utils/logger');

(async () => {
  try {
  
    const symbol = 'BTCUSDT'; // Trading pair
    const investingAmount = 10; // Amount to buy
    const buyingMaxPrice = 85126.72;

    logMessage('Starting trading bot with Binance Testnet...');
    await monitorMarket(symbol,investingAmount,buyingMaxPrice);
  } catch (error) {
    console.error('Error starting bot:', error.message);
  }
})();



