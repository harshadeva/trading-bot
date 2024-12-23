require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

// Base URL for Binance Spot Testnet
const API_BASE_URL = 'https://testnet.binance.vision/api';

// Create a signed query string
function signQuery(queryParams) {
  const queryString = new URLSearchParams(queryParams).toString();
  const signature = crypto
    .createHmac('sha256', process.env.API_SECRET)
    .update(queryString)
    .digest('hex');
  return `${queryString}&signature=${signature}`;
}

// Axios instance with API key
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'X-MBX-APIKEY': process.env.API_KEY },
});

module.exports = { axiosInstance, signQuery };
