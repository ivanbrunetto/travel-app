import { expect, it, jest } from '@jest/globals';
import { getLatLong } from '../src/server/geolocation'

it('tests getLatLong with network error', async () => {
    const expRes = {
        error: 1,
        message: 'err-message',
        data: null
    }

    const cityName = 'city-test';
    const expFetchUrl = `http://api.geonames.org/searchJSON?q=${cityName}&username=${process.env.geonames_username}`;

    const mockFetch = jest.fn(() => Promise.reject({ message: expRes.message }));
    global.fetch = mockFetch;

    const res = await getLatLong(cityName);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});

it('tests getLatLong with geonames error', async () => {
    const expFetchResult = {
        ok: 0,
        status: 'test-status'
    }

    const expRes = {
        error: 1,
        message: `geonames error, response status: ${expFetchResult.status}`,
        data: null
    }

    const cityName = 'city-test';
    const expFetchUrl = `http://api.geonames.org/searchJSON?q=${cityName}&username=${process.env.geonames_username}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const res = await getLatLong(cityName);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});


it('tests getLatLong with geonames error message', async () => {
    const expGeonamesResponse = {
        status: {
            message: 'geonames-error-message',
            value: 1
        }
    }
    const expFetchResult = {
        ok: 1,
        status: 'test-status',
        json: () => Promise.resolve(expGeonamesResponse)
    }

    const expRes = {
        error: 1,
        message: `geonames error: ${expGeonamesResponse.status.value} ${expGeonamesResponse.status.message}`,
        data: null
    }

    const cityName = 'city-test';
    const expFetchUrl = `http://api.geonames.org/searchJSON?q=${cityName}&username=${process.env.geonames_username}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const res = await getLatLong(cityName);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});

it('tests getLatLong', async () => {
    const expGeonamesResponse = {
        testData: 'test'
    }

    const expFetchResult = {
        ok: 1,
        status: 0,
        json: () => Promise.resolve(expGeonamesResponse)
    }

    const expRes = {
        error: 0,
        message: `geonames processed successfully`,
        data: expGeonamesResponse
    }

    const cityName = 'city-test';
    const expFetchUrl = `http://api.geonames.org/searchJSON?q=${cityName}&username=${process.env.geonames_username}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const res = await getLatLong(cityName);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});
