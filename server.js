const express = require('express')
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

//server mmiddleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/', require('./routes'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));