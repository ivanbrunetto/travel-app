import Immutable from 'immutable';
//import buttonIcon from '../images/remove_circle_32_white.png';
//import { getGeoLocation } from './geolocation';
import { fetchData } from './serverfetch';

const trips = Immutable.List([]);


export async function formHandler(event) {
    event.preventDefault();

    const trip = composeBasicTripInfo();

    if (!validateStartDate(trip)) {
        return;
    }
    if (!validateDuration(trip)) {
        return;
    }

    getGeoLocation(trip)
        .then(() => {
            if (!validateGeoLocation(trip)) {
                throw new Error();
            }
        })
        .then(() => getWeather(trip))
        .then(() => {
            //TODO: get pic
            trip.picSource = '/tbd.png';
        })
        .then(() => {
            trips.push(Immutable.Map(trip));
            renderComponent(trip);
        })
        .catch(error => {
            console.log(error);
        })

}

export function composeBasicTripInfo() {
    const trip = {};

    trip.destination = document.getElementById('destination').value;
    trip.departing = new Date(document.getElementById('start-date').value);
    trip.returning = new Date(document.getElementById('end-date').value);
    trip.duration = (trip.returning.getTime() - trip.departing.getTime()) / (1000 * 60 * 60 * 24);
    const now = new Date();
    trip.timeDistance = Math.floor((trip.departing.getTime() - now.getTime() + (now.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24)) + 1;
    return trip;
}

export function validateStartDate(trip) {
    if (trip.timeDistance < 0) {
        alert('Trip must not be in the past');
        return false;
    }
    return true;
}


export function validateDuration(trip) {
    if (trip.duration <= 0) {
        alert('End date must be greater then start date');
        return false;
    }
    return true;
}

export function validateGeoLocation(trip) {
    if (!trip.geoInfo) {
        alert(`Invalid destination '${trip.destination}' please try again`);
        return false;
    }
    return true;
}

export async function getGeoLocation(trip) {
    const data = await fetchData(`/latlong?city=${trip.destination}`);
    if (data.geonames && data.geonames[0] && trip.destination.toLowerCase() === data.geonames[0].name.toLowerCase()) {
        trip.geoInfo = {
            gname: `${data.geonames[0].toponymName}, ${data.geonames[0].countryCode}`,
            lat: data.geonames[0].lat,
            lng: data.geonames[0].lng
        }
    } else {
        console.log('Could not find geoinfo with destination name: ', trip.destination);
    }
}

export async function getWeather(trip) {
    //since the weatherbit forecast for free account is limited for max. 7 days (including the current)
    //we will fetch data only if trip distance is bellow it
    if (trip.timeDistance > 6) {
        console.log('Weather forecast longer than 7 days is not supported currently');
        return;
    }

    const data = await fetchData(`/weather/forecast?lat=${trip.geoInfo.lat}&lng=${trip.geoInfo.lng}`);

    if (!data) {
        console.log('Could not get weather from ', trip.geoInfo.gname);
        return;
    }

    trip.weatherInfo = {
        high: data.data[trip.timeDistance].max_temp,
        low: data.data[trip.timeDistance].min_temp,
        description: data.data[trip.timeDistance].weather.description,
        icon: data.data[trip.timeDistance].weather.icon
    }
}


function renderComponent(trip) {
    const tripCard = document.createElement('div');
    tripCard.setAttribute('class', 'trip-card');

    tripCard.innerHTML = `
    <img
                            class="trip-card__image"
                            src=${trip.picSource}
                            alt="Destination photo"
                        />
                        <div class="trip-card__info">
                            <div class="trip-card__text-box">
                                <p class="trip-card__title">
                                    My Trip To: ${trip.destination}
                                </p>
                                <p class="trip-card__title">
                                    Departing: ${new Date(trip.departing.getTime() + (trip.departing.getTimezoneOffset() * 60 * 1000)).toDateString()}
                                </p>
                            </div>

                            <div class="trip-card__text-box">
                                <p class="trip-card__text">
                                    ${trip.destination} is ${trip.timeDistance} days away!
                                </p>
                            </div>

                            ${trip.weatherInfo ? `
                                <div class="trip-card__text-box">
                                <p class="trip-card__text">
                                    Typical weather for then is:
                                </p>
                                <p class="trip-card__text">
                                    High: ${trip.weatherInfo.high}, Low: ${trip.weatherInfo.low}<br>
                                    ${trip.weatherInfo.description}
                                </p>
                                </div>
                                ` : ``}
                            
                        </div>
                        <div class="trip-card__button-container">
                            <button class="trip-card__button">
                                <img
                                    src='../images/remove_circle_32_white.png'
                                    width="20"
                                    alt=""
                                />
                                &nbsp;&nbsp;Remove
                            </button>
                        </div>
    `;

    //add to the DOM
    const tripListElement = document.getElementById('trip-list');
    tripListElement.appendChild(tripCard);
}
