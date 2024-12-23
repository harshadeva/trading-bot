function logMessage(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

module.exports = { logMessage };
