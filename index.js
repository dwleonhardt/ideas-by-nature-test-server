const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
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
app.use('/exchange', exchange);
app.use('/kraken', kraken);
