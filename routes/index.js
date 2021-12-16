const router = require('express').Router();
const apiRoutes = require('./api');

// router.use('/', (req, res) => res.send('Welcome to the API!'));
router.use('/api', apiRoutes);

module.exports = router;
