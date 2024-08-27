dotenv = require('dotenv');
dotenv.config();

const URL = 'http://api.geonames.org/'
const username = process.env.geonames_username;

exports.getLatLong = async (cityName) => {
    const fetchURL = `${URL}/searchJSON?q=${cityName}&username=${username}`;
    try {
        const response = await fetch(fetchURL);
        if (!response.ok) {
            throw new Error(`geonames error, response status: ${response.status}`);
        }

        const json = await response.json();
        if (json.status) {
            throw new Error(`geonames error: ${json.status.value} ${json.status.message}`);
        }

        return {
            error: 0,
            message: 'geonames processed successfully',
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

//this.getLatLong('city').then(result => console.log(result.data));
//console.log(username);
