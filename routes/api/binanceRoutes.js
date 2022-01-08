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

router.get('/coinbase/account', (req, res) => {
  try {
    coinbasePro.fetchBalance()
      .then(balance => res.json(balance));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/coinbase/:asset', (req, res) => {
  const { asset } = req.params;
  console.log("coinbase asset", asset);
  try {
    console.log("coinbasePro methods", coinbasePro);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
// list all buys in coinbase
router.get('/coinbase/buys', async (req, res) => {
  try {
    const buys = [];
    console.log("buys", buys);
    res.json(buys);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get history
router.get('/history/:symbol', async ({params: {symbol}}, res) => {
  try {
    const {data} = await axios.get(`https://data.alpaca.markets/v1beta1/crypto/${symbol}/bars`, {
      params: {
        limit: 1000,
        timeframe: '5Min'
      },
      headers: {
        'APCA-API-KEY-ID': process.env.APCA_API_KEY_ID,
        'APCA-API-SECRET-KEY': process.env.APCA_API_SECRET_KEY
      }
    });
    console.info(data);
    res.status(200).json({ symbol, data });
  } catch (error) {
    console.error(error);
  }
});

// a POST route to receive webhook alerts from tradingview
router.post('/tradingview/alerts', (req, res) => {
  try {
    console.log("tradingview alerts", req);
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
