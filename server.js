'use strict';

console.log('Howdy, from the server');

require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 300;

const weather = require('./weather.js');
const getMovies = require('./movies.js');

app.get('/weather', weatherHandler);
app.get('/movies', getMovies);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then((summaries) => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

app.listen(PORT, () => console.log(`Server up on ${PORT}`));
