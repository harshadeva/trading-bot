const { getMarketPrice } = require("./market");
const { placeSellOrder, placeBuyOrder, immediateSell } = require("./order");
const { hasActiveBuy } = require("./database");
const { logMessage } = require('../utils/logger');
const { getAccountBalance } = require('./account');

// Monitor the market and execute trades based on thresholds
async function monitorMarket(symbol,investingAmount) {
  const TRANSACTION_FEE_PERCENT = 0.001; // Binance transaction fee (0.1%)

  setInterval(async () => {
    try {
      const currentPrice = await getMarketPrice(symbol);
      const activeBuy = await hasActiveBuy(symbol);
      const qty = investingAmount / currentPrice;
      const quantity = Number(qty.toFixed(5));

      if (activeBuy) {
        const buyPrice = currentPrice;
        const sellValue = currentPrice * quantity;
        const buyValue = buyPrice * quantity;
        const sellFee = sellValue * TRANSACTION_FEE_PERCENT;
        const profit = sellValue - activeBuy.buy_amount - sellFee;

        console.log(
          `Buy Price: $${activeBuy.buy_price}, Current Price: $${currentPrice}, Profit After Fee: $${profit}, Transaction Fee: $${sellFee}`
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
      if(error.response?.data.code == -2010){
      getAccountBalance();
      immediateSell('SNTUSDT', 10000);
      }
    }
  }, 5000); // Check every 5 seconds
}

module.exports = { monitorMarket };
