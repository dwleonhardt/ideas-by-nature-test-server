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
    axios.get('http://coincap.io/page/DASH'),
    axios.get('http://coincap.io/page/ETH'),
    axios.get('http://coincap.io/page/LTC'),
    axios.get('http://coincap.io/page/BTC')
  ])
  .then(([kraken, wex, capDash, capEth, capLtc, capBtc]) => {
    const names = ['DASH', 'ETH', 'LTC', 'BTC']
    console.log('price usd' + capDash.data.price_usd);
    let currentPrices = {};
    let krakenKeys = Object.keys(kraken.data.result);
    let wexKeys = Object.keys(wex.data);
    currentPrices[names[0]] = {
      price: capDash.data.price_usd,
      volume: capDash.data.volume,
      capChange: capDash.data.cap24hrChange
    }
    currentPrices[names[1]] = {
      price: capEth.data.price_usd,
      volume: capEth.data.volume,
      capChange: capEth.data.cap24hrChange
    }
    currentPrices[names[2]] = {
      price: capLtc.data.price_usd,
      volume: capLtc.data.volume,
      capChange: capLtc.data.cap24hrChange
    }
    currentPrices[names[3]] = {
      price: capBtc.data.price_usd,
      volume: capBtc.data.volume,
      capChange: capBtc.data.cap24hrChange
    }
    for (var i = 0; i < names.length; i++) {
      let krakenPrice = new Number(kraken.data.result[krakenKeys[i]]['c'][0]);
      let wexPrice = new Number(wex.data[wexKeys[i]]['last']);
      let averagePrice = ((krakenPrice + wexPrice + currentPrices[names[i]].price) / 3);
      currentPrices[names[i]].price = averagePrice;
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
            price: currentPrices[type].price,
            volume: currentPrices[type].volume,
            cap24hrChange: currentPrices[type].capChange
          })
          .then((data) => {
            console.log(data);
          })
        })
      })

    }
    knex
    .select('currency_id','price', 'volume', 'cap24hrChange', 'time', 'currency.name')
    .from('price')
    .join('currency', 'currency.id', 'currency_id')
    .orderBy('time', 'desc')
    .limit(4)
    .then((data) => {
      res.send(data);
    })

  })
  .catch(error => {
    console.log(error);
  });
})

module.exports = router;
