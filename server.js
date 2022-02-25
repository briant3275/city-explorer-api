'use strict';

// console.log('Babys first server!');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// const weatherData = require('./data/weather.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;

// base route
app.get('/', (request, response) => {
  response.send('Howdy from the Server!');
});




app.get('/weather', async (request, response) => {

  try {
    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=7&lat=${lat}&lon=${lon}`;

    let getWeather = await axios.get(url);
    // weatherArray.push(getWeather);
    console.log('getweather!!!!!!!!!!!!!', getWeather.data.data[0].weather.description);
    console.log('getweather!!!!!!!!!opopopopo!!!!', getWeather.data.data[0].datetime);

    let dataToSend = getWeather.data.data.map(day => new Forecast(day.datetime, day.weather.description));
    console.log('41!!!!!!!!!!!!!!!!', dataToSend);


    response.send(dataToSend);
  } catch (error) {
    console.log(error);
    throw new Error('Weather Data Currently Unavailable');
  }
});

app.get('/movies', async (request, response) => {
  try {
    let searchQuery = request.query.searchQuery;
    let url = `https://api.themoviebd.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;

    let getMovieObject = await axios.get(url);

    let movieToSend = getMovieObject.data.results.map(movie => new Movies(movie.title, movie.release_date, movie.overview));
    console.log('heeeeyyyyyyyyyyy', movieToSend);
    response.send(movieToSend);
  } catch (error) {
    throw new Error('Movie Data Currently Unavailable');
  }
});


app.get('*', (request, response) => {
  response.status(404).send(`Not Found`);
});

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Movies {
  constructor(title, release_date, overview) {
    this.title = title;
    this.release_date = release_date;
    this.overview = overview;
  }
}


app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});


app.listen(PORT, () => console.log(`listening on port ${PORT}`));
