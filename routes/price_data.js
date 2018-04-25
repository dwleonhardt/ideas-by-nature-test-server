const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require('axios');
const knex = require('../knex');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
  Promise.all([
    axios.get('https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD,ETHUSD,LTCUSD,DASHUSD'),
    axios.get('https://wex.nz/api/3/ticker/dsh_usd-eth_usd-ltc_usd-btc_usd'),
    // axios.get('http://coincap.io/front')
  ])
  .then(([kraken, wex]) => {
    const names = ['DASH', 'ETH', 'LTC', 'BTC']

    let currentPrices = {};
    let krakenKeys = Object.keys(kraken.data.result);
    let wexKeys = Object.keys(wex.data);

    for (var i = 0; i < names.length; i++) {
      let krakenPrice = new Number(kraken.data.result[krakenKeys[i]]['c'][0]);
      let wexPrice = new Number(wex.data[wexKeys[i]]['last']);
      let averagePrice = (krakenPrice + wexPrice) / 2;
      currentPrices[names[i]] = averagePrice;
    }

    for (var currency in currentPrices) {
      let type = currency;
      knex('currency')
      .select('*')
      .where('name', type)
      .then((data) => {
        if(!data.length){
          knex('currency')
          .insert({name: type})
          .then(data => {
            console.log(data);
          })
        }
        knex('currency')
        .select('*')
        .where('name', type)
        .then((data) => {
          knex('price')
          .insert({
            currency_id: data[0].id,
            price: currentPrices[type]
          })
        })
      })

    }
    knex('price')
    .then((data) => {
      res.send(data);
    })

  })
  .catch(error => {
    console.log(error);
  });
})

module.exports = router;
