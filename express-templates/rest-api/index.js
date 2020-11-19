const express = require('express')
const path = require('path');
const app = express()

app.use(express.json(), express.urlencoded({extended: false}));

const baseResponse = 'Welcome to your basic REST api, this is your default HTTP';

app.get('/', (req,res) => {
  res.send(`${baseResponse} GET request`);

});

app.post('/', (req,res) => {
  let value = req.body;
  console.log(value);
  res.send(`${baseResponse} POST request`);

});

app.put('/', (req,res) => {
  let value = req.body;
  console.log(value);
  res.send(`${baseResponse} PUT request`);

});

app.patch('/', (req,res) => {
  let value = req.body;
  console.log(value);
  res.send(`${baseResponse} PATCH request`);

});

app.delete('/', (req,res) => {
  res.send(`${baseResponse} DELETE request`);

});




let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}


app.listen(port, () => {
  console.log('server started on port 5000');
})
