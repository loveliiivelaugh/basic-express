const router = require('express').Router();
const ccxt = require('ccxt');

const coinbasePro = new ccxt.coinbasepro({
  apiKey: process.env.CBPRO_API_KEY,
  secret: process.env.CBPRO_API_SECRET,
  password: process.env.CBPRO_API_PASSWORD,
});

const kraken = new ccxt.kraken({
  apiKey: process.env.KRAKEN_API_KEY,
  secret: process.env.KRAKEN_API_SECRET
});


router.get('/coinbase/account', (req, res) => {
  try {
    coinbasePro.fetchBalance()
      .then(balance => res.json(balance));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/kraken/account', (req, res) => {
  try {
    console.log("kraken methods", kraken);
    kraken.fetchBalance()
      .then(balance => res.json(balance));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get history
router.get('/history/:symbol/:interval', ({ params: { symbol, interval } }, res) => {
  // try {
  //   binance.candlesticks(symbol || "BNBBTC", interval || "1d", (error, ticks, symbol) => {
  //     console.info("candlesticks()", ticks);
  //     const data = ticks.map(tick => {
  //       let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;
  //       return {
  //         time,
  //         open,
  //         high,
  //         low,
  //         close,
  //         volume,
  //       };
  //     });
  //     console.info(data);
  //     res.status(200).json({ symbol, data });
  //   }, { limit: 100000, endTime: 1514764800000 });
  // } catch (error) {
  //   console.log(error);
  // }
});

module.exports = router;

// const tick = async () => {
//   const { asset, base, allocation, spread, tickInterval } = config;
//   const market = `${asset}/${base}`;

//   const orders = await binanceClient.fetchOpenOrders(market);
//   orders.forEach(async order => await binanceClient.cancelOrder(order.id));

//   const results = await Promise.all([
//     // coin geck api simple price bincance
//     axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=${base}`),
//     axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=${base}`),
//   ])

//   const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd;

//   const sellPrice = marketPrice * (1 + spread);
//   const buyPrice = marketPrice * (1 - spread);
//   const balances = await binanceClient.fetchBalance();
//   const assetBalance = balances.free[asset];
//   const baseBalance = balances.free[base];
//   const sellBolume = assetBalance * allocation;
//   const buyVolume = (baseBalance * allocation) / marketPrice; 

//   console.log(`
//   Something is better than nothing
//   `)
// };

// const run = () => {
//   const config = {
//     asset: 'BTC',
//     base: 'USDT',
//     allocation: 0.1,
//     spread: 0.2,
//     tickInterval: 2000,
//   };

//   const binanceClient = new ccxt.binance({
//     apiKey: config.apiKey,
//     secret: config.secret,
//   });

//   tick(config, binanceClient);
//   setInterval(tick, config.tickInterval, config, binanceClient);
// };

// run();