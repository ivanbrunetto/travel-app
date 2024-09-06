import { expect, it, jest } from '@jest/globals';
import { getImage } from '../src/server/imageretriever'

it('tests getImage with network error', async () => {
    const expRes = {
        error: 1,
        message: 'err-message',
        data: null
    }

    const q = 'test';
    const expFetchUrl = `https://pixabay.com/api/?key=${process.env.pixabay_key}&q=${q}`;

    const mockFetch = jest.fn(() => Promise.reject({ message: expRes.message }));
    global.fetch = mockFetch;

    const res = await getImage(q);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});


it('tests getImage with error', async () => {
    const expPixabayResponse = {
        error: 'error'
    }
    const expFetchResult = {
        ok: 1,
        status: 'test-status',
        json: () => Promise.resolve(expPixabayResponse)
    }

    const expRes = {
        error: 1,
        message: `pixabay error: ${expPixabayResponse.error}`,
        data: null
    }

    const q = 'test';
    const expFetchUrl = `https://pixabay.com/api/?key=${process.env.pixabay_key}&q=${q}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const res = await getImage(q);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});


it('tests getImage', async () => {
    const expPixabayResponse = {
        testData: 'test'
    }
    const expFetchResult = {
        ok: 1,
        status: 'test-status',
        json: () => Promise.resolve(expPixabayResponse)
    }

    const expRes = {
        error: 0,
        message: `pixabay processed successfully`,
        data: expPixabayResponse
    }

    const q = 'test';
    const expFetchUrl = `https://pixabay.com/api/?key=${process.env.pixabay_key}&q=${q}`;

    const mockFetch = jest.fn(() => Promise.resolve(expFetchResult));
    global.fetch = mockFetch;

    const res = await getImage(q);
    expect(mockFetch.mock.calls[0][0]).toBe(expFetchUrl);
    expect(mockFetch.mock.calls).toHaveLength(1);
    expect(res).toStrictEqual(expRes);
});
