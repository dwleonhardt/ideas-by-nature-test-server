const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const knex = require('../knex');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', function (req, res) {
  let send = req.body.send.currency;
  let recieve = req.body.recieve.currency;
  let response = {};
  knex
  .select('currency_id','price', 'time', 'currency.name')
  .from('price')
  .join('currency', 'currency.id', 'currency_id')
  .where('currency.name', send)
  .orderBy('time', 'desc')
  .limit(1)
  .then((data) => {
    response['sendPrice'] = data[0].price;
    knex
    .select('currency_id','price', 'time', 'currency.name')
    .from('price')
    .join('currency', 'currency.id', 'currency_id')
    .where('currency.name', recieve)
    .orderBy('time', 'desc')
    .limit(1)
    .then((data) => {
      response['recievePrice'] = data[0].price;
    })
    .then((data) => {
      res.send(response);
    })
  })

})

module.exports = router;
