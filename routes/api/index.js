const router = require('express').Router();
// const photosRoutes = require('./photosRoutes.js');
const gpt3Routes = require('./gpt3Routes.js');
// const shopifyRoutes = require('./shopifyRoutes.js');
// const plaidRoutes = require('./plaidRoutes.js');
// const alpacaRoutes = require('./alpacaRoutes.js');
// const dialogFlowRoutes = require('./dialogFlowRoutes.js');
// const spotifyRoutes = require('./spotifyRoutes.js');
// const twitterRoutes = require('./twitterRoutes.js');
// const binanceRoutes = require('./binanceRoutes.js');

// router.use('/photos', photosRoutes);
router.use('/gpt3', gpt3Routes);
// router.use('/shopify', shopifyRoutes);
// router.use('/plaid', plaidRoutes);
// router.use('/alpaca', alpacaRoutes);
// router.use('/dialogFlow', dialogFlowRoutes);
// router.use('/spotify', spotifyRoutes);
// router.use('/twitter', twitterRoutes);
// router.use('/binance', binanceRoutes);

router.use('/', (req, res) => {
  res.send('Welcome to the API!');
});

module.exports = router;
