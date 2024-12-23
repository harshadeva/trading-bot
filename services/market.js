const { axiosInstance } = require('../config/binance');

// Fetch current market price
async function getMarketPrice(symbol) {
  const response = await axiosInstance.get('/v3/ticker/price', {
    params: { symbol },
  });
  return parseFloat(response.data.price);
}

module.exports = { getMarketPrice };
