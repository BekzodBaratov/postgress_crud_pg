require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000

app.use(express.json())

// initialize route
app.use('/api/v1/', require('./routes'))

app.listen(port, ()=>console.log('Server listening on port '+port))