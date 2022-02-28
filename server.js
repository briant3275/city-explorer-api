'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  response.send('Howdy from the Server!');
});

const weather = require('./weather');
const getMovies = require('./movies');


app.get('/weather', weatherHandler);
app.get('/movies', getMovies);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then((summaries) => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

// app.get('/weather', async (request, response) => {
//   try {
//     let lat = request.query.lat;
//     let lon = request.query.lon;

//     let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=7&lat=${lat}&lon=${lon}`;

//     let getWeather = await axios.get(url);

//     let dataToSend = getWeather.data.data.map(day => new Forecast(day));

//     response.send(dataToSend);
//   } catch (error) {
//     response.status(500).send('500, cannot retrieve forecast');
//   }
// });

// app.get('/movies', async (request, response) => {
//   try {
//     let searchQuery = request.query.cityName;

//     let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${searchQuery}`;

//     let getMovieObject = await axios.get(url);

//     let movieToSend = getMovieObject.data.results.map(movie => new Movies(movie));
//     response.send(movieToSend);
//   } catch (error) {
//     response.status(500).send('500, cannot retrieve movies');
//   }
// });


app.get('*', (request, response) => {
  response.status(404).send(`Not Found`);
});

// class Forecast {
//   constructor(day) {
//     this.date = day.datetime;
//     this.description = day.weather.description;
//     this.low = day.low_temp;
//     this.high = day.high_temp;
//   }
// }

// class Movies {
//   constructor(movie) {
//     this.title = movie.original_title;
//     this.release = movie.release_date;
//     this.overview = movie.overview;
//     this.rating = movie.vote_average;
//     this.votes = movie.vote_count;
//   }
// }


app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});


app.listen(PORT, () => console.log(`listening on port ${PORT}`));
