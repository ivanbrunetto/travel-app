import { expect, test, jest } from '@jest/globals';
import { composeBasicTripInfo, validateStartDate, validateDuration, validateGeoLocation } from '../src/client/js/App';
import { getGeoLocation } from '../src/client/js/geolocation';

jest.mock('../src/client/js/geolocation');

test('composeBasicTripInfo', () => {
    const duration = 10;
    const timeDistance = 1;

    const departingDate = new Date(Date.now() + (timeDistance * 1000 * 60 * 60 * 24));
    const departing = new Date(getDateString(departingDate));
    const returning = new Date(departing.getTime() + (duration * 1000 * 60 * 60 * 24));
    const expTrip = {
        destination: 'expDest',
        departing: departing,
        returning: returning,
        duration: duration,
        timeDistance: timeDistance
    }

    document.body.innerHTML = `
        <input type="text" id="destination" value="${expTrip.destination}"/>
        <input type="date" id="start-date" value="${getDateString(new Date(expTrip.departing.getTime() + (expTrip.departing.getTimezoneOffset() * 60 * 1000)))}"/>
        <input type="date" id="end-date" value="${getDateString(new Date(expTrip.returning.getTime() + (expTrip.returning.getTimezoneOffset() * 60 * 1000)))}"/>
    `;

    const trip = composeBasicTripInfo();
    expect(trip).toEqual(expTrip);

});

function getDateString(date) {
    let month = date.getMonth() + 1, day = date.getDate(), year = date.getFullYear();

    if (month < 10) {
        month = '0' + month;
    }

    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
}


test('validateDuration', () => {
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    expect(validateDuration({ duration: 1 })).toBeTruthy();
    expect(validateDuration({ duration: 0 })).toBeFalsy();
    expect(mockAlert.mock.calls).toHaveLength(1);
});

test('validateStartDate', () => {
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    expect(validateStartDate({ timeDistance: 0 })).toBeTruthy();
    expect(validateStartDate({ timeDistance: 1 })).toBeTruthy();
    expect(validateStartDate({ timeDistance: -1 })).toBeFalsy();
    expect(mockAlert.mock.calls).toHaveLength(1);
});

test('validateGetGeoLocation', async () => {
    const mockAlert = jest.fn();
    window.alert = mockAlert;

    getGeoLocation.mockResolvedValue();
    expect(await validateGeoLocation({ destination: 'anything' })).toBeFalsy();
    expect(mockAlert.mock.calls).toHaveLength(1);

    getGeoLocation.mockResolvedValue({});
    expect(await validateGeoLocation({ destination: 'anything' })).toBeTruthy();
    expect(mockAlert.mock.calls).toHaveLength(1);



});