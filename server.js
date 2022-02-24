'use strict';

console.log('Babys first server!');

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const weatherData = require('./data/weather.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

// base route
app.get('/', (request, response) => {
    response.send('Howdy from the Server!');
});


app.get('/throw-an-error', (request, response) => {
    
    app.get('/weather', (request, response) => {
        try {
            let cityName = request.query.cityName;
            
            let foundCity = weatherData.find(weather => weather.city_name === cityName);
            //   let selectedCity = new Weather(foundCity);
            
            let forecastArray = foundCity.data.map(day => new Forecast(day));
            response.send(forecastArray);
        } catch (error) {
        throw new Error('Weather Data Currently Unavailable');
    };
});

app.get('*', (request, response) => {
    response.status(404).send(`Not Found`);
});

class Forecast {
    constructor(day) {
        this.date = day.datetime;
        this.description = day.weather.description;
    }
}

app.use((error, request, response, next) => {
    console.log(error.message);
    response.status(500).send(error.message);
});


app.listen(PORT, () => console.log(`listening on port ${PORT}`));
