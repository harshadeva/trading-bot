const { axiosInstance, signQuery } = require('../config/binance');
const { createByTrade,updateSellTrade } = require('./database');

// Place a buy order
async function placeBuyOrder(symbol, quantity, price) {
  console.log(`Buying ${quantity} ${symbol} for $${price}`);

  const queryParams = {
    symbol,
    side: 'BUY',
    type: 'LIMIT',
    timeInForce: 'GTC',
    quantity,
    price: price.toFixed(2),
    timestamp: Date.now(),
  };
  console.log(queryParams);

  const signedQuery = signQuery(queryParams);

  const response = await axiosInstance.post(`/v3/order?${signedQuery}`);
  await createByTrade(symbol, 'BUY', price, quantity);
  return response.data;
}

// Place a sell order
async function placeSellOrder(buyRecord,symbol, quantity, sellPrice, transactionFee, profit) {
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
  await updateSellTrade(buyRecord, sellPrice, transactionFee, profit);
  return response.data;
}

// Function to get symbol filters from /v3/exchangeInfo
async function getSymbolFilters(symbol) {
  const response = await axiosInstance.get(`/v3/exchangeInfo`);
  const symbolInfo = response.data.symbols.find(s => s.symbol === symbol);

  if (!symbolInfo) {
    throw new Error('Symbol not found');
  }

  const lotSizeFilter = symbolInfo.filters.find(filter => filter.filterType === 'LOT_SIZE');
  const priceFilter = symbolInfo.filters.find(filter => filter.filterType === 'PRICE_FILTER');

  return {
    minQty: parseFloat(lotSizeFilter.minQty),
    maxQty: parseFloat(lotSizeFilter.maxQty),
    stepSize: parseFloat(lotSizeFilter.stepSize),
    minPrice: parseFloat(priceFilter.minPrice),
    maxPrice: parseFloat(priceFilter.maxPrice),
    tickSize: parseFloat(priceFilter.tickSize),
  };
}

async function immediateSell(symbol,quantity) {
    getMarketPrice(symbol).then(async (price) => {
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
    });
}

module.exports = {
  placeBuyOrder,
  placeSellOrder,
  getSymbolFilters,
  immediateSell
};
