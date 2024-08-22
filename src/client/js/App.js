import Immutable from 'immutable';
import buttonIcon from '../images/remove_circle_32_white.png';

const trips = Immutable.List([]);


export function formHandler(event) {
    event.preventDefault();
    console.log('addTrip clicked');

    const destination = document.getElementById('destination').value;
    console.log('Detination: ', destination);

    const today = new Date();
    const departing = document.getElementById('start-date').value
    const startDate = new Date(departing);
    const endDate = new Date(document.getElementById('end-date').value);
    const durationDays = getDays(startDate, endDate);
    if (durationDays <= 0) {
        alert('End date must be greater then start date');
        return;
    }

    const timeDistance = (getDays(today, startDate));
    if (timeDistance < 0) {
        alert('Trip must not be in the past');
        return;
    }

    const trip = {
        destination: destination,
        departing: departing,
        durationDays: durationDays,
        timeDistance: timeDistance,
    };

    //TODO: get geolocation

    //TODO: get weatherinfo
    trip.weather = 'to be defined...'

    //TODO: get pic
    trip.picSource = '';

    trips.push(Immutable.Map(trip));
    renderComponent(trip);
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
                                    src=${buttonIcon}
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
    console.log(endDate);
    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

