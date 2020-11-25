const {Router} = require('express');
const router = Router();

//set default REST api routes
const baseResponse = 'Welcome to your basic REST api, this is your default HTTP';
router.route('/')
  .get( (req,res) => {
    res.send(`${baseResponse} GET request`);

  })
  .post( (req,res) => {
    let value = req.body;
    console.log(value);
    res.send(`${baseResponse} POST request`);

  })
  .put( (req,res) => {
    let value = req.body;
    console.log(value);
    res.send(`${baseResponse} PUT request`);

  })
  .patch( (req,res) => {
    let value = req.body;
    console.log(value);
    res.send(`${baseResponse} PATCH request`);

  })
  .delete( (req,res) => {
    res.send(`${baseResponse} DELETE request`);

  });

exports.router = router;
