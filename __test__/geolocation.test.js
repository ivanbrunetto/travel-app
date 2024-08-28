import { expect, test, jest } from '@jest/globals';
import { getGeoLocation } from '../src/client/js/geolocation';


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
                    toponymName: 'Toponym',
                    name: 'Name',
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
    expect(res.destination).toBe(`${mockServerResp.data.geonames[0].toponymName}, ${mockServerResp.data.geonames[0].countryCode}`);
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
                    toponymName: 'Toponym',
                    name: 'Name',
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
    expect(res.destination).toBe(`${mockServerResp.data.geonames[0].toponymName}, ${mockServerResp.data.geonames[0].countryCode}`);
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
                    toponymName: 'Toponym',
                    name: 'Name',
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

test('get geolocation nothing found', async () => {
    const mockServerResp = {
        error: 0,
        message: 'test-message-ok',
        data: {

        }
    }

    global.fetch = jest.fn(() => Promise.resolve({
        status: 'test-status-ok',
        ok: 1,
        json: () => Promise.resolve(mockServerResp)
    }));

    const res = await getGeoLocation('anything');
    expect(res).toBeUndefined();
});

test('get geolocation nothing found 2', async () => {
    const mockServerResp = {
        error: 0,
        message: 'test-message-ok',
        data: {
            geonames: [

            ]
        }
    }

    global.fetch = jest.fn(() => Promise.resolve({
        status: 'test-status-ok',
        ok: 1,
        json: () => Promise.resolve(mockServerResp)
    }));

    const res = await getGeoLocation('anything');
    expect(res).toBeUndefined();
});

