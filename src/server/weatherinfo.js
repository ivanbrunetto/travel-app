dotenv = require('dotenv');
dotenv.config();

const baseURL = 'http://api.weatherbit.io/v2.0';

exports.getCurrentWeather = async (lat, lng) => {
    const fetchURL = `${baseURL}/current?lat=${lat}&lon=${lng}&key=${process.env.weatherbit_apiKey}`;
    return getWeather(fetchURL, lat, lng);
}

exports.getWeatherForecast = async (lat, lng) => {
    const fetchURL = `${baseURL}/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.weatherbit_apiKey}`;
    return getWeather(fetchURL, lat, lng);
}

const getWeather = async (fetchURL, lat, lng) => {
    try {
        const response = await fetch(fetchURL);
        /* if (!response.ok) {
            throw new Error(`weatherbit error, response status: ${response.status}`);
        } */

        const json = await response.json();

        if (json.error) {
            throw new Error(`weatherbit error: ${json.error}`);
        }

        return {
            error: 0,
            message: 'weatherbit processed successfully',
            data: json
        }
    }
    catch (err) {
        console.log(err.message);
        return {
            error: 1,
            message: err.message,
            data: null
        }
    }
}

//this.getCurrentWeather('35.7796', '-78.6382').then(result => console.log(result));
//this.getWeatherForecast('35.7796', '-78.6382').then(result => console.log(result.data.data[0]));
