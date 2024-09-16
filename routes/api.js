// routes/tickers.js
const express = require('express');
const axios = require('axios');
const Ticker = require('../modals/data');
const router = express.Router();

// Fetch and store top 10 tickers in the database
async function fetchAndStoreTickers() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = response.data;

    // Select top 10 tickers
    const topTickers = Object.keys(tickers).slice(0, 10).map(key => ({
      name: key,
      last: parseFloat(tickers[key].last),
      buy: parseFloat(tickers[key].buy),
      sell: parseFloat(tickers[key].sell),
      volume: parseFloat(tickers[key].volume),
      base_unit: tickers[key].base_unit,
    }));

    // Clear the existing tickers and insert new ones
    await Ticker.deleteMany({}); // Clear old data
    await Ticker.insertMany(topTickers); // Insert new data
    console.log('Tickers have been stored in the database');
  } catch (error) {
    console.error('Error fetching or storing tickers:', error);
  }
}

// Fetch new data and store it at server start
fetchAndStoreTickers();
setInterval(fetchAndStoreTickers, 3600000); // Fetch every hour

// GET route to return stored tickers
router.get('/', async (req, res) => {
  try {
    const tickers = await Ticker.find({});
    res.json(tickers);
  } catch (error) {
    res.status(500).send('Error fetching tickers from database');
  }
});

module.exports = router;
