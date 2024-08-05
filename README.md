# Project Description

Capstone Project taken from Udacity **Front End Web Developer** Nanodegree course.

It consists of a simple form where you enter the location you are traveling to and the date you are leaving. If the trip is within a week, you will get the current weather forecast. If the trip is in the future, you will get a predicted forecast.


Following are the project prerequisites:

- Webserver - Node
- Web application framework for routing - Express
- Build tool - Webpack
- External script - Service Worker
- External API - Openweather, Geonames, Weatherbit

# Usage

git clone https://github.com/ivanbrunetto/travel-app.git

`cd` into evaluate-news-nlp folder and run:
- `npm install`
- `npm build-prod`
- `npm run start`

Get valid API keys at:
- https://openweathermap.org/
- https://www.geonames.org/
- https://www.weatherbit.io/
- https://pixabay.com/

create .env file at the project root folder and add your API keys as:
`owm-key=<your key value>`
`gn-key=<your key value>`
`wb-key=<your key value>`
`pb-key=<your key value>`

Open web browser and go to 'localhost:8000'

# Dependencies 

Check package.json file for more information
