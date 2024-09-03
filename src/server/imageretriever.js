dotenv = require('dotenv');
dotenv.config();

const baseURL = 'https://pixabay.com/api/';

exports.getImage = async (q) => {
    try {
        const fetchURL = `${baseURL}?key=${process.env.pixabay_key}&q=${q}`
        console.log(fetchURL);
        const response = await fetch(fetchURL);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`pixabay error: ${text}`);
        }

        const json = await response.json();

        if (json.error) {
            throw new Error(`pixabay error: ${json.error}`);
        }

        return {
            error: 0,
            message: 'pixabay processed successfully',
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

this.getImage('Campinas').then(result => console.log(result));
