const connectToMongo = require('./db');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

connectToMongo();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Import Routes
const API = require('./routes/api');

// Use Routes
app.use('/', API);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
