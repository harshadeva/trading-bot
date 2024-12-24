const { getMarketPrice } = require("./market");
const { placeSellOrder, placeBuyOrder } = require("./order");
const { hasActiveBuy } = require("./database");
const { logMessage } = require('../utils/logger');
const { getAccountBalance } = require('./account');

// Monitor the market and execute trades based on thresholds
async function monitorMarket(symbol,investingAmount) {
  const TRANSACTION_FEE_PERCENT = 0.001; // Binance transaction fee (0.1%)

  setInterval(async () => {
    try {
      logMessage('Monitoring..');
      const currentPrice = await getMarketPrice(symbol);
      console.log('currentPrice',currentPrice);
      const activeBuy = await hasActiveBuy(symbol);
      console.log('activeBuy',activeBuy);
      const qty = investingAmount / currentPrice;
      console.log('qty',qty);
      const quantity = Number(qty.toFixed(5));
      console.log('quantity',quantity);
      // getAccountBalance();

      if (activeBuy) {
        const buyPrice = currentPrice;
        const sellValue = currentPrice * quantity;
        const buyValue = buyPrice * quantity;
        const sellFee = sellValue * TRANSACTION_FEE_PERCENT;
        const profit = sellValue - buyValue - sellFee;

        console.log(
          `Buy Price: $${buyPrice}, Current Price: $${currentPrice}, Profit After Fee: $${profit}`
        );

        // Check if the profit exceeds a certain threshold
        // if (currentPrice >= sellThreshold && profit > 0) {
        if (profit > 0.000000000000001) {
          console.log(`Profit is positive. Placing SELL order.`);
          await placeSellOrder(activeBuy,symbol, quantity, currentPrice,TRANSACTION_FEE_PERCENT, profit);
        } else {
          console.log(`Profit is negative or below threshold. Waiting.`);
        }
      }

      if (!activeBuy) {
        console.log(`Placing new BUY order.`);
        await placeBuyOrder(symbol, quantity, currentPrice);
      }
    } catch (error) {
      console.error(
        "Error monitoring market:",
        error.response?.data || error.message
      );
      if(error.response.code == -2010){
      getAccountBalance();
      }
    }
  }, 5000); // Check every 5 seconds
}

module.exports = { monitorMarket };
