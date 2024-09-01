const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const geo = require('./geolocation');
const weather = require('./weatherinfo');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));

//GET routes
app.get('/api/latlong', (req, res) => {
    console.log(':: GET /api/latlong');
    const city = req.query.city;
    geo.getLatLong(city).then(latlong => res.send(latlong));
});

app.get('/api/weather/current', (req, res) => {
    console.log(':: GET /api/weather/current');
    const lat = req.query.lat, lng = req.query.lng;
    weather.getCurrentWeather(lat, lng).then(weatherData => res.send(weatherData));
});

app.get('/api/weather/forecast', (req, res) => {
    console.log(':: GET /api/weather/forecast');
    const lat = req.query.lat, lng = req.query.lng;
    weather.getWeatherForecast(lat, lng).then(weatherData => res.send(weatherData));
});

// POST Routes


// Designates what port the app will listen to for incoming requests
app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
});
