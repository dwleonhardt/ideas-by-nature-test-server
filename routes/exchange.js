const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', function (req, res) {
  console.log(req.body)
  res.send({value: 6});
})

module.exports = router;
