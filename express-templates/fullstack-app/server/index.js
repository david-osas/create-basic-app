const express = require('express')
const path = require('path');
const app = express()

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json(), express.urlencoded({extended: false}));

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));

});




let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}


app.listen(port, () => {
  console.log('server started on port 5000');
})
