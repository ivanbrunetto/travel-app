/**
 * @jest-environment jsdom
 */

import { expect, it, jest } from '@jest/globals';
import { fetchData } from '../src/client/js/serverfetch';

it('tests fetchData with network error', async () => {
    global.fetch = jest.fn(() => Promise.reject({ message: 'error test' }));


    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const res = await fetchData('');
    expect(mockAlert.mock.calls[0][0]).toBe('Network error');
    expect(mockAlert.mock.calls).toHaveLength(1);
    expect(res).toBeUndefined();
});

it('tests fetchData with server error', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({
            error: 1,
            message: 'test error message',
            data: null
        })
    }));

    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const res = await fetchData('');
    expect(mockAlert.mock.calls[0][0]).toBe('There was a server processing error');
    expect(mockAlert.mock.calls).toHaveLength(1);
    expect(res).toBeUndefined();
});


it('tests fetchData with success case', async () => {
    const expectedWeatherData = {
        error: 0,
        message: 'test message',
        data: 'test data'
    }

    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(expectedWeatherData)
    }));

    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const res = await fetchData('');
    expect(mockAlert.mock.calls).toHaveLength(0);
    expect(res).toBe(expectedWeatherData.data);
});
