import { expect, it, jest } from '@jest/globals';
import { getWeatherForecast, getCurrentWeather } from '../src/server/weatherinfo'

it('tests getWeatherForecast with network error', async () => {
    const expRes = {
        error: 1,
        message: 'err-message',
        data: null
    }

    const lat = 0;
    const lon = 0;
    const expFetchUrl = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.weatherbit_apiKey}`;

    const mockFetch = jest.fn(() => Promise.reject({ message: expRes.message }));
    global.fetch = mockFetch;

    const res = await getWeatherForecast(lat, lon);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});



it('tests getWeatherForecast with error', async () => {
    const expWeatherbitResponse = {
        error: 'error'
    }
    const expFetchResult = {
        ok: 1,
        status: 'test-status',
        json: () => Promise.resolve(expWeatherbitResponse)
    }

    const expRes = {
        error: 1,
        message: `weatherbit error: ${expWeatherbitResponse.error}`,
        data: null
    }

    const lat = 0;
    const lon = 0;
    const expFetchUrl = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.weatherbit_apiKey}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const res = await getWeatherForecast(lat, lon);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});

it('tests getWeatherForecast', async () => {
    const expWeatherbitResponse = {
        testData: 'test'
    }
    const expFetchResult = {
        ok: 1,
        status: 'test-status',
        json: () => Promise.resolve(expWeatherbitResponse)
    }

    const expRes = {
        error: 0,
        message: `weatherbit processed successfully`,
        data: expWeatherbitResponse
    }

    const lat = 0;
    const lon = 0;
    const expFetchUrl = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.weatherbit_apiKey}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const res = await getWeatherForecast(lat, lon);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});

it('tests geCurrentWeather', async () => {
    const expWeatherbitResponse = {
        testData: 'test'
    }
    const expFetchResult = {
        ok: 1,
        status: 'test-status',
        json: () => Promise.resolve(expWeatherbitResponse)
    }

    const expRes = {
        error: 0,
        message: `weatherbit processed successfully`,
        data: expWeatherbitResponse
    }

    const lat = 0;
    const lon = 0;
    const expFetchUrl = `http://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${process.env.weatherbit_apiKey}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const res = await getCurrentWeather(lat, lon);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});
