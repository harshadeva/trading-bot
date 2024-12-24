const db = require("../config/db");

// Log trades to the database
async function createByTrade(symbol, side, price, quantity, status = "ACTIVE") {
  const query = `
      INSERT INTO trades (symbol, side, buy_price, quantity, status,buy_amount)
      VALUES ($1, $2, $3, $4, $5,$6)
    `;
  await db.query(query, [symbol, side, price, quantity, status,price*quantity]);
}

// Check if there's an active buy record
async function hasActiveBuy(symbol) {
  const query = `
      SELECT * FROM trades
      WHERE symbol = $1 AND side = 'BUY' AND status = 'ACTIVE'
      LIMIT 1
    `;
  const { rows } = await db.query(query, [symbol]);
  return rows.length > 0 ? rows[0] : null;
}

async function getLastRecord(symbol) {
  const query = `
      SELECT * FROM trades
      WHERE symbol = $1 AND side = 'BUY' AND status = 'SOLD' ORDER BY id DESC
      LIMIT 1
    `;
  const { rows } = await db.query(query, [symbol]);
  return rows.length > 0 ? rows[0] : null;
}

// Update Sell Trade
async function updateSellTrade(buyRecord, sellPrice, transactionFee, profit) {
  const query = `
      UPDATE trades
      SET sell_price = $1,
          transaction_fee = $2,
          profit = $3,
          status = 'SOLD',
          sell_amount = $5,
          timestamp = NOW(),
      WHERE id = $4;
    `;

  const values = [sellPrice, transactionFee, profit, buyRecord.id,sellPrice*buyRecord.quantity];

  try {
    await db.query(query, values);
    console.log(`Sell trade updated for ID: ${buyRecord.id}`);
  } catch (error) {
    console.error("Error updating sell trade:", error.message);
    throw error;
  }
}

module.exports = {
  createByTrade,
  hasActiveBuy,
  getLastRecord,
  updateSellTrade,
};
