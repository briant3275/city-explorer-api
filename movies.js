'use strict';

let cache = require('./cache.js');
const axios = require('axios');

async function getMovies (request, response) {
  try {
    let nameOfCity = request.query.nameOfCity;
    let key = 'movies-' + nameOfCity;
    if(cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24)){
      console.log('Cache Hit, Movies data present');
      response.status(200).send(cache[key].data);
    } else {
      console.log('Cache Miss, Movies data not present');
      let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${nameOfCity}`;

      let movieResults = await axios.get(movieUrl);

      const movieArr = movieResults.data.results.map(
        (movie) => new Movies(movie)
      );
      cache[key]={};
      cache[key].timestamp = Date.now();
      cache[key].data = movieArr;
      response.send(movieArr);
    }
    return cache[key].data;
  } catch (error) {
    response.status(500).send('500, cannot retrieve movies');
  }
}

class Movies {
  constructor(movie) {
    this.title = movie.original_title;
    this.release = movie.release_date;
    this.overview = movie.overview;
    this.rating = movie.vote_average;
    this.votes = movie.vote_count;
  }
}

module.exports = getMovies;
