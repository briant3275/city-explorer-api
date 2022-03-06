'use strict';

let cache = require('./cache.js');
const axios = require('axios');

async function getMovies (request, response) {
  try {
    let nameOfCity = request.query.nameOfCity;
    let key = 'movies-' + nameOfCity;
    if(cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24)){
      console.log('Cache Hit, Movies present');
      response.status(200).send(cache[key].data);
    } else {
      console.log('Cache Miss, Movies not present');
      let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${nameOfCity}`;

      let movieResults = await axios.get(movieUrl);

      const movieArr = movieResults.data.results.map(
        (movie) => new Movies(movie)
      );
      cache[key]={};
      cache[key].timestamp = Date.now();
      cache[key].data = movieArr;

      console.log(movieResults);
      console.log(movieArr);

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
    this.overview = movie.overview;
    this.rating = movie.vote_average;
    this.votes = movie.vote_count;
    this.release = movie.release_date;
    this.img_url = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'no-poster';
  }
}

module.exports = getMovies;
