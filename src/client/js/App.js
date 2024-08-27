import Immutable from 'immutable';
//import buttonIcon from '../images/remove_circle_32_white.png';

const trips = Immutable.List([]);

const serverURL = 'http://localhost:8000/api';

export function formHandler(event) {
    event.preventDefault();

    const trip = composeBasicTripInfo();

    if (!validateStartDate(trip)) {
        return;
    }
    if (!validateDuration(trip)) {
        return;
    }

    getGeoLocation(trip.destination).then(geoInfo => trip.geoInfo = geoInfo);

    //TODO: get weatherinfo
    trip.weather = 'to be defined...'

    //TODO: get pic
    trip.picSource = '/tbd.png';

    trips.push(Immutable.Map(trip));
    renderComponent(trip);
}

export function composeBasicTripInfo() {
    const trip = {};

    trip.destination = document.getElementById('destination').value;
    trip.departing = document.getElementById('start-date').value;
    trip.returning = document.getElementById('end-date').value;
    trip.duration = getDays(new Date(trip.departing), new Date(trip.returning));
    trip.timeDistance = getDays(new Date(), new Date(trip.departing));

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

export async function getGeoLocation(destination) {
    try {
        const response = await fetch(`${serverURL}/latlong?${destination}`)
        if (response.error) {
            console.log(response.message);
            alert(response.message);
            return;
        }

        const geoName = response.data.geonames[0];
        if (destination.toLowerCase() === geoName.toponymName.toLowerCase()) {
            return {
                destination: `${geoName.toponymName}, ${geoName.countryCode}`,
                lat: geoName.lat,
                lng: geoName.lng
            }
        }
    } catch (err) {
        console.log(err.message);
        alert('Server is down');
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
                                    Departing: ${trip.departing}
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

function getDays(startDate, endDate) {
    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

