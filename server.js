'use strict';

console.log('Babys first server!');

const express = require('express');
const req = require('express/lib/request');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3002;

const weatherData = require('./data/weather.json');

app.get('/', (request, response) => {
  response.send('Howdy from the Server!');
});

app.get('/banana', (request, response) => {
  response.send('Nanners');
});

app.get('/sayHello', (request, response) => {
  let name = request.query.name;
  console.log(request.query);
  console.log(name);
  response.status(200).send(`Hello ${name}, from the server!`);
});

app.get('/throw-an-error', (request, response) => {
  throw 'You done effed up';
});

app.get('/weather', (request, response) => {
  let cityName = request.query.city_name;
//   console.log(cityName);

  let cityObj = weatherData.find(weather => weather.cityName === cityName);
  let selectedCity = new Weather(cityObj);
  response.send(selectedCity);
});

app.get('*', (request, response) => {
  response.status(404).send(`this ain't it bruh`);
});

class Weather {
  constructor(weather){
    this.cityName = weather.city_name;
    this.temp = weather.temp;
  }
}

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
