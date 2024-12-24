const { signQuery,axiosInstance } = require('./config/binance');
const { getMarketPrice } = require('./services/market');
const { monitorMarket } = require('./services/monitor');
const { placeSellOrder } = require('./services/order');
const { logMessage } = require('./utils/logger');

(async () => {
  try {
    // const symbol = 'EOSUSDT'; // Trading pair
    // getMarketPrice(symbol).then(async (price) => {
    //   const response = await immediateSell(symbol, 1000, price);
    //   console.log(response);
    // });
    const symbol = 'BTCUSDT'; // Trading pair
    const investingAmount = 10; // Amount to buy

    logMessage('Starting trading bot with Binance Testnet...');
    await monitorMarket(symbol,investingAmount);
  } catch (error) {
    console.error('Error starting bot:', error.message);
  }
})();


async function immediateSell(symbol, quantity,sellPrice) {
 
  const queryParams = {
    symbol,
    side: 'SELL',
    type: 'LIMIT',
    timeInForce: 'GTC',
    quantity,
    price: sellPrice.toFixed(2),
    timestamp: Date.now(),
  };

  const signedQuery = signQuery(queryParams);

  const response = await axiosInstance.post(`/v3/order?${signedQuery}`);
  return response.data;
}



