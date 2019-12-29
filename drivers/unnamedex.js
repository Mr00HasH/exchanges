const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { result: tickers } = await request('https://api.unnamed.exchange/v1/Public/Ticker');

  return tickers
    .filter((ticker) => ticker.marketStatus === 'OK')
    .map((ticker) => {
      const [base, quote] = ticker.market.split('_');

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume),
        baseVolume: parseToFloat(ticker.baseVolume),
        close: parseToFloat(ticker.close),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
};
