const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const exchange = require('./routes/exchange');
const priceData = require('./routes/price_data');
const knex = require('knex');


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
app.use('/price_data', priceData);


const getData = () => {
  axios.get('https://ideas-by-nature-test.herokuapp.com/price_data');
}

setInterval(getData, 60000);
