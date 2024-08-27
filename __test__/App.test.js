import { expect, test, jest } from '@jest/globals';
import { getGeoLocation, composeBasicTripInfo, validateStartDate, validateDuration } from '../src/client/js/App';


test('get geolocation error case', async () => {
    const mockServerResp = {
        error: 1,
        message: 'test message'
    }

    window.fetch = jest.fn(() => Promise.resolve(mockServerResp));

    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const res = await getGeoLocation('');
    expect(mockAlert.mock.calls[0][0]).toBe(mockServerResp.message);
    expect(res).toBeUndefined();

});

test('get geolocation same name', async () => {
    const mockServerResp = {
        error: 0,
        data: {
            geonames: [
                {
                    toponymName: 'Name',
                    countryCode: 'CC',
                    lat: "1.0",
                    lng: "-1.0"
                }
            ]
        }
    }

    window.fetch = jest.fn(() => Promise.resolve(mockServerResp));

    const res = await getGeoLocation('name');
    expect(res.destination).toBe('Name, CC');
    expect(res.lat).toBe('1.0');
    expect(res.lng).toBe('-1.0');

});

test('get geolocation same name caps', async () => {
    const mockServerResp = {
        error: 0,
        data: {
            geonames: [
                {
                    toponymName: 'Name',
                    countryCode: 'CC',
                    lat: "1.0",
                    lng: "-1.0"
                }
            ]
        }
    }

    window.fetch = jest.fn(() => Promise.resolve(mockServerResp));
    let res = await getGeoLocation('nAmE');
    expect(res.destination).toBe('Name, CC');
    expect(res.lat).toBe('1.0');
    expect(res.lng).toBe('-1.0');

});

test('get geolocation different name', async () => {
    const mockServerResp = {
        error: 0,
        data: {
            geonames: [
                {
                    toponymName: 'name',
                    countryCode: 'CC',
                    lat: "1.0",
                    lng: "-1.0"
                }
            ]
        }
    }

    window.fetch = jest.fn(() => Promise.resolve(mockServerResp));

    const res = await getGeoLocation('name different');
    expect(res).toBeUndefined();
});

test('composeBasicTripInfo', () => {
    const duration = 10;
    const timeDistance = 15;
    const departing = Date.now() + (timeDistance * 1000 * 60 * 60 * 24);
    const departingDate = new Date(departing);
    const returning = departing + (duration * 1000 * 60 * 60 * 24);
    const returningDate = new Date(returning);
    const expTrip = {
        destination: 'expDest',
        departing: `${departingDate.getFullYear()}-${getDateNumStr(departingDate.getMonth())}-${departingDate.getDate()}`,
        returning: `${returningDate.getFullYear()}-${getDateNumStr(returningDate.getMonth())}-${returningDate.getDate()}`,
        duration: duration + 1,
        timeDistance: timeDistance
    }

    document.body.innerHTML = `
        <input type="text" id="destination" value="${expTrip.destination}"/>
        <input type="date" id="start-date" value="${expTrip.departing}"/>
        <input type="date" id="end-date" value="${expTrip.returning}"/>
    `;

    const trip = composeBasicTripInfo();
    expect(trip).toEqual(expTrip);

});

function getDateNumStr(date) {
    return date + 1 < 10 ? '0' + (date + 1) : (date + 1);
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