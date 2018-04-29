const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const knex = require('../knex');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
  let currency = req.query.currency;
  let start = req.query.start;
  let end = req.query.end;
  knex
  .select('currency_id','price', 'time', 'currency.name')
  .from('price')
  .join('currency', 'currency.id', 'currency_id')
  .where('currency.name', currency)
  .orderBy('time', 'desc')
  .whereBetween('time', [start, end])
  .whereRaw('extract(hour from time)::integer % 5 = 0')
  .then((data) => {
    console.log(data);
    res.send(data);
  })
})

module.exports = router;
