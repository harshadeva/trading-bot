const { axiosInstance, signQuery } = require('../config/binance');

async function getAccountBalance() {
  const queryParams = {
    timestamp: Date.now(),
  };
  const signedQuery = signQuery(queryParams);

  const response = await axiosInstance.get(`/v3/account?${signedQuery}`);
  console.log(response.data);
  return response.data;
}


module.exports = {
  getAccountBalance
};
