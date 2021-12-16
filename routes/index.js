const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);
router.use('/', (req, res) => {
  res.send('Welcome to the API!');
});

module.exports = router;
