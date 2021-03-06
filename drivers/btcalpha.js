const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { throttleMap, parseToFloat } = require('../lib/utils');

module.exports = async (isMocked) => {
  const markets = await request('https://btc-alpha.com/api/v1/pairs/');

  const tickers = throttleMap(markets, async (market) => {
    const [ticker] = await request(`https://btc-alpha.com/api/charts/${market.name}/D/chart/?limit=1`);

    if (!ticker) return undefined;

    const base = market.currency1;
    const quote = market.currency2;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.close),
    });
  }, isMocked ? 0 : 200); // 5 requests per second

  return Promise.all(tickers);
};
