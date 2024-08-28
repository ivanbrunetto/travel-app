import Immutable from 'immutable';
//import buttonIcon from '../images/remove_circle_32_white.png';
import { getGeoLocation } from './geolocation';

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

    /* if (!await validateGeoLocation(trip)) {
        return;
    } */

    getGeoLocation(trip.destination)
        .then(geoInfo => {
            if (!geoInfo) {
                alert(`Invalid destination '${trip.destination}' please try again`);
                throw new Error();
            }
            trip.geoInfo = geoInfo;
        })
        .then(() => {
            //TODO: get weatherinfo
            trip.weather = 'to be defined...'
        })
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

export async function validateGeoLocation(trip) {
    trip.geoInfo = await getGeoLocation(trip.destination);
    if (!trip.geoInfo) {
        alert(`Invalid destination '${trip.destination}' please try again`);
        return false;
    }
    return true;
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
                                    My Trip To: ${trip.geoInfo.destination}
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

                            <div class="trip-card__text-box">
                                <p class="trip-card__text">
                                    Typical weather for then is:
                                </p>
                                <p class="trip-card__text">
                                    ${trip.weather}
                                </p>
                            </div>
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
