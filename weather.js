'use strict';

let cache = require('./cache.js');
const axios = require('axios');

async function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&days=5&units=I&lat=${latitude}&lon=${longitude}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24)) {
    console.log('Cache hit, weather present');
  } else {
    console.log('Cache miss, weather not present');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios
      .get(url)
      .then((response) => parseWeather(response.data));
  }
  // console.log(cache[key].data);
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map((day) => {
      return new Forecast(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Forecast {
  constructor(day) {
    this.description = day.weather.description;
    this.date = day.datetime;
    this.low = day.low_temp;
    this.high = day.high_temp;
  }
}

module.exports = getWeather;
