import { expect, it, jest } from '@jest/globals';
import { composeBasicTripInfo, validateStartDate, validateDuration, getGeoLocation, validateGeoLocation, getWeather, getImage } from '../src/client/js/App';
import { fetchData } from '../src/client/js/serverfetch';

jest.mock('../src/client/js/serverfetch');

it('tests composeBasicTripInfo', () => {
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

it('tests validateDuration', () => {
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    expect(validateDuration({ duration: 1 })).toBeTruthy();
    expect(validateDuration({ duration: 0 })).toBeFalsy();
    expect(mockAlert.mock.calls).toHaveLength(1);
});

it('tests validateStartDate', () => {
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    expect(validateStartDate({ timeDistance: 0 })).toBeTruthy();
    expect(validateStartDate({ timeDistance: 1 })).toBeTruthy();
    expect(validateStartDate({ timeDistance: -1 })).toBeFalsy();
    expect(mockAlert.mock.calls).toHaveLength(1);
});

it('tests getGeolocation', async () => {
    const mockServerResp = {
        geonames: [
            {
                toponymName: 'Toponym',
                name: 'Name',
                countryCode: 'CC',
                lat: "1.0",
                lng: "-1.0"
            }
        ]
    };

    const trip = {
        destination: 'name'
    };

    const expTrip = {
        ...trip,
        geoInfo: {
            gname: `${mockServerResp.geonames[0].toponymName}, ${mockServerResp.geonames[0].countryCode}`,
            lat: mockServerResp.geonames[0].lat,
            lng: mockServerResp.geonames[0].lng
        }
    };

    fetchData.mockResolvedValue(mockServerResp);
    await getGeoLocation(trip);
    expect(trip).toEqual(expTrip);
});

it('tests getGeolocation with caps', async () => {
    const mockServerResp = {
        geonames: [
            {
                toponymName: 'Toponym',
                name: 'Name',
                countryCode: 'CC',
                lat: "1.0",
                lng: "-1.0"
            }
        ]
    };

    const trip = {
        destination: 'NaMe'
    };

    const expTrip = {
        ...trip,
        geoInfo: {
            gname: `${mockServerResp.geonames[0].toponymName}, ${mockServerResp.geonames[0].countryCode}`,
            lat: mockServerResp.geonames[0].lat,
            lng: mockServerResp.geonames[0].lng
        }
    };

    fetchData.mockResolvedValue(mockServerResp);
    await getGeoLocation(trip);
    expect(trip).toEqual(expTrip);
});

it('tests getGeolocation with different name', async () => {
    const mockServerResp = {
        geonames: [
            {
                toponymName: 'Toponym',
                name: 'Name',
                countryCode: 'CC',
                lat: "1.0",
                lng: "-1.0"
            }
        ]
    };

    const trip = {
        destination: 'Different name'
    };

    const expTrip = { ...trip };

    fetchData.mockResolvedValue(mockServerResp);
    await getGeoLocation(trip);
    expect(trip).toEqual(expTrip);
});

it('tests getGeolocation when nothing found', async () => {
    const trip = {
        destination: 'Anything'
    };

    const expTrip = { ...trip };

    fetchData.mockResolvedValue({});
    await getGeoLocation(trip);
    expect(trip).toEqual(expTrip);

    fetchData.mockResolvedValue({ geonames: [] });
    await getGeoLocation(trip);
    expect(trip).toEqual(expTrip);
});

it('tests validateGetGeoLocation', async () => {
    const mockAlert = jest.fn();
    window.alert = mockAlert;

    const trip = {
        destination: 'test',
    }

    expect(validateGeoLocation(trip)).toBeFalsy();
    expect(mockAlert.mock.calls).toHaveLength(1);
    expect(mockAlert.mock.calls[0][0]).toBe(`Invalid destination '${trip.destination}' please try again`);

    trip.geoInfo = {};
    expect(validateGeoLocation(trip)).toBeTruthy();
    expect(mockAlert.mock.calls).toHaveLength(1);
});

it('tests getWeather current', async () => {
    const mockServerResp = {
        data: [
            {
                max_temp: 10,
                min_temp: 0,
                weather: {
                    description: 'test desc',
                    icon: 'test icon'
                }
            }
        ]
    }
    const trip = {
        destination: 'Test',
        timeDistance: 0,
        geoInfo: {
            gname: 'gname-test',
            lat: 1,
            lng: 1
        }
    };

    const expTrip = {
        ...trip,
        weatherInfo: {
            high: mockServerResp.data[trip.timeDistance].max_temp,
            low: mockServerResp.data[trip.timeDistance].min_temp,
            description: mockServerResp.data[trip.timeDistance].weather.description,
            icon: mockServerResp.data[trip.timeDistance].weather.icon
        }
    };

    fetchData.mockResolvedValue(mockServerResp);
    await getWeather(trip);
    expect(trip).toEqual(expTrip);
})

it('tests getWeather forecast', async () => {
    const mockServerResp = {
        data: [
            {},
            {
                max_temp: 10,
                min_temp: 0,
                weather: {
                    description: 'test desc',
                    icon: 'test icon'
                }
            }
        ]
    }
    const trip = {
        destination: 'Test',
        timeDistance: 1,
        geoInfo: {
            gname: 'gname-test',
            lat: 1,
            lng: 1
        }
    };

    const expTrip = {
        ...trip,
        weatherInfo: {
            high: mockServerResp.data[trip.timeDistance].max_temp,
            low: mockServerResp.data[trip.timeDistance].min_temp,
            description: mockServerResp.data[trip.timeDistance].weather.description,
            icon: mockServerResp.data[trip.timeDistance].weather.icon
        }
    };

    fetchData.mockResolvedValue(mockServerResp);
    await getWeather(trip);
    expect(trip).toEqual(expTrip);
})

it('tests getWeather forecast over 7 days', async () => {
    const trip = {
        destination: 'Test',
        timeDistance: 7,
        geoInfo: {
            gname: 'gname-test',
            lat: 1,
            lng: 1
        }
    };

    const expTrip = { ...trip };

    await getWeather(trip);
    expect(trip).toEqual(expTrip);
})

it('tests getWeather with error', async () => {
    const trip = {
        destination: 'Test',
        geoInfo: {
            gname: 'gname-test',
            lat: 1,
            lng: 1
        }
    };

    const expTrip = { ...trip };

    fetchData.mockResolvedValue();
    await getWeather(trip);
    expect(trip).toEqual(expTrip);
})

it('tests getImage', async () => {
    const mockServerResp = {
        total: 1,
        hits: [
            {
                largeImageURL: 'https://imageURL-test',
                pageURL: 'https://pageURL-test'
            }
        ]
    }
    const trip = {
        destination: 'Test',
    };

    const expTrip = {
        ...trip,
        image: {
            picSource: mockServerResp.hits[0].largeImageURL,
            pageURL: mockServerResp.hits[0].pageURL
        }
    };

    fetchData.mockResolvedValue(mockServerResp);
    await getImage(trip);
    expect(trip).toEqual(expTrip);
})

it('tests getImage with no hits', async () => {
    const mockServerResp = {
        total: 0,
        hits: [
        ]
    }
    const trip = {
        destination: 'Test',
    };

    const expTrip = { ...trip };

    fetchData.mockResolvedValue(mockServerResp);
    await getImage(trip);
    expect(trip).toEqual(expTrip);
})

it('tests getImage with error', async () => {
    const trip = {
        destination: 'Test',
    };

    const expTrip = { ...trip };

    fetchData.mockResolvedValue();
    await getImage(trip);
    expect(trip).toEqual(expTrip);
})
