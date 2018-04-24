const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require('axios');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {

  axios.get('https://api.kraken.com/0/public/AssetPairs')
  .then(response => {
    console.log(response.data);
    res.send(response.data)
  })
  .catch(error => {
    console.log(error);
  });
})

module.exports = router;
