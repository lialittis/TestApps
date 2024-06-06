// app.js
const express = require('express');  
const app = express();
app.get('/', function (req, res) {
 res.send('Hello,Docker!');
});  
app.listen(3000);
console.log('Server is running on http://localhost:3000');
