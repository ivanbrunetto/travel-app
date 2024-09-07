/**
 * @jest-environment jsdom
 */

import { expect, it, jest } from '@jest/globals';
import { fetchData } from '../src/client/js/serverfetch';

it('tests fetchData with network error', async () => {
    const testEndpoint = '/test';
    const expFetchUrl = `http://localhost:8000/api${testEndpoint}`;

    const mockFetch = jest.fn(() => Promise.reject({ message: 'test-error-message' }));
    global.fetch = mockFetch;

    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const res = await fetchData(testEndpoint);
    expect(mockAlert.mock.calls[0][0]).toBe('Network error');
    expect(mockAlert.mock.calls).toHaveLength(1);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toBeUndefined();
});

it('tests fetchData with server error', async () => {
    const expServerResponse = {
        error: 1,
        message: 'test-message',
        data: null
    }

    const expFetchResult = {
        json: () => Promise.resolve(expServerResponse)
    }

    const testEndpoint = '/test';
    const expFetchUrl = `http://localhost:8000/api${testEndpoint}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const res = await fetchData(testEndpoint);
    expect(mockAlert.mock.calls[0][0]).toBe('There was a server processing error');
    expect(mockAlert.mock.calls).toHaveLength(1);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toBeUndefined();
});


it('tests fetchData with success case', async () => {
    const expServerResponse = {
        error: 0,
        message: 'test message',
        data: {
            a: 'some test data',
            b: 'etc..'
        }
    }

    const expFetchResult = {
        json: () => Promise.resolve(expServerResponse)
    }

    const testEndpoint = '/test';
    const expFetchUrl = `http://localhost:8000/api${testEndpoint}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const res = await fetchData(testEndpoint);
    expect(mockAlert.mock.calls).toHaveLength(0);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expServerResponse.data);
});
