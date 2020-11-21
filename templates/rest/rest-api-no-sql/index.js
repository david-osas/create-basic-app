// import server modules
const express = require('express');
const mongoose = require('mongoose');

//initialze server app
const app = express();

//set middleware to parse data being exchanged between front and back ends
app.use(express.json(), express.urlencoded({extended: false}));

//connect mongoose ODM to your MongoDB database
const mongoDBLink = 'enter your database url here'
try{
  mongoose.connect(mongoDBLink, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}catch(e){
  console.log(e);
}

//default user schema definition
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String
});

//initialze a User model
const User = mongoose.model('User', userSchema);


//set default REST api routes
const baseResponse = 'Welcome to your basic REST api, this is your default HTTP';
app.route('/')
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



//set port variable for either production or development environments
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

//listen to http requests made to server
app.listen(port, () => {
  console.log('server started on port 5000');
})
