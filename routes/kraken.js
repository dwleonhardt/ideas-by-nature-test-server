const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require('axios');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
  Promise.all([
    axios.get('https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD'),
    axios.get('https://wex.nz/api/3/ticker/btc_usd'),
    // axios.get('http://coincap.io/front')
  ])
  .then(([kraken, wex]) => {
    let krakenSell = new Number(kraken.data.result['XXBTZUSD']['c'][0]);
    let wexSell = new Number (wex.data['btc_usd']['last']);
    let averageSell =  (krakenSell + wexSell) / 2;
    res.send(
      {
        averageSell: averageSell,
      }
    )
  })
  .catch(error => {
    console.log(error);
  });
})

module.exports = router;
