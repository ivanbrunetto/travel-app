import { expect, test, jest } from '@jest/globals';
import { getGeoLocation, composeBasicTripInfo, validateStartDate, validateDuration } from '../src/client/js/App';


test('get geolocation response nok', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
        status: 'test-status-nok',
        ok: 0
    }));


    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const res = await getGeoLocation('');
    //expect(mockAlert.mock.calls[0][0]).toBe('Server is down');
    expect(mockAlert.mock.calls).toHaveLength(1);
    expect(res).toBeUndefined();

});


test('get geolocation error case', async () => {
    const mockServerResp = {
        error: 1,
        message: 'test-message-error'
    }

    global.fetch = jest.fn(() => Promise.resolve({
        status: 'test-status-ok',
        ok: 1,
        json: () => Promise.resolve(mockServerResp)
    }));


    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const res = await getGeoLocation('');
    //expect(mockAlert.mock.calls[0][0]).toBe(mockServerResp.message);
    expect(mockAlert.mock.calls).toHaveLength(1);
    expect(res).toBeUndefined();

});

test('get geolocation same name', async () => {
    const mockServerResp = {
        error: 0,
        message: 'test-message-ok',
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

    global.fetch = jest.fn(() => Promise.resolve({
        status: 'test-status-ok',
        ok: 1,
        json: () => Promise.resolve(mockServerResp)
    }));

    const res = await getGeoLocation('name');
    expect(res.destination).toBe('Name, CC');
    expect(res.lat).toBe('1.0');
    expect(res.lng).toBe('-1.0');

});

test('get geolocation same name caps', async () => {
    const mockServerResp = {
        error: 0,
        message: 'test-message-ok',
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

    global.fetch = jest.fn(() => Promise.resolve({
        status: 'test-status-ok',
        ok: 1,
        json: () => Promise.resolve(mockServerResp)
    }));

    let res = await getGeoLocation('nAmE');
    expect(res.destination).toBe('Name, CC');
    expect(res.lat).toBe('1.0');
    expect(res.lng).toBe('-1.0');

});

test('get geolocation different name', async () => {
    const mockServerResp = {
        error: 0,
        message: 'test-message-ok',
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

    global.fetch = jest.fn(() => Promise.resolve({
        status: 'test-status-ok',
        ok: 1,
        json: () => Promise.resolve(mockServerResp)
    }));

    const res = await getGeoLocation('name different');
    expect(res).toBeUndefined();
});

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