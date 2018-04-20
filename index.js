const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const kraken = require('./routes/kraken');


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Listening on port', port);
});
app.use('/kraken', kraken);
