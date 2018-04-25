const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const exchange = require('./routes/exchange');
const kraken = require('./routes/kraken');


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Listening on port', port);
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/exchange', exchange);
app.use('/kraken', kraken);


const getData = () => {
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

    console.log(currentPrices);

  })
  .catch(error => {
    console.log(error);
  });
}

// setInterval(getData, 10000);
