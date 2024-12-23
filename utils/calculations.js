const { getSymbolFilters } = require('../services/order');

async function adjustQuantity(quantity,symbol) {
    const exchangeInfo = await getSymbolFilters(symbol);
    minQty = exchangeInfo.minQty;
    maxQty = exchangeInfo.maxQty;
    stepSize = exchangeInfo.stepSize;

    // Ensure the quantity is within the minimum and maximum limits
    if (quantity < minQty) {
      throw new Error(`Quantity is below the minimum limit: ${minQty}`);
    }
    if (quantity > maxQty) {
      throw new Error(`Quantity is above the maximum limit: ${maxQty}`);
    }
  
    // Adjust the quantity to the nearest valid step size
    const adjustedQuantity =
      Math.floor(quantity / stepSize) * stepSize;
  
    // Ensure the adjusted quantity does not fall below the minimum limit
    if (adjustedQuantity < minQty) {
      throw new Error(`Adjusted quantity is below the minimum limit: ${minQty}`);
    }
  
    return parseFloat(adjustedQuantity.toFixed(8)); // Ensure precision is correct
  }

  module.exports = { adjustQuantity };