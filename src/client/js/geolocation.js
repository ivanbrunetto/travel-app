const serverURL = 'http://localhost:8000/api';


export async function getGeoLocation(destination) {
    try {
        const response = await fetch(`${serverURL}/latlong?city=${destination}`)
        /* if (!response.ok) {
            console.log('server response status: ', response.status);
            alert('Could not get destination info');
            return;
        } */

        const json = await response.json();
        if (json.error) {
            console.log('Server error message: ', json.message);
            alert('Could not get detination (geo) info');
            return;
        }

        const geoNames = json.data.geonames;
        if (geoNames && geoNames[0] && destination.toLowerCase() === geoNames[0].name.toLowerCase()) {
            return {
                destination: `${geoNames[0].toponymName}, ${geoNames[0].countryCode}`,
                lat: geoNames[0].lat,
                lng: geoNames[0].lng
            }
        } else {
            console.log('Could not find geoinfo with destination name: ', destination);
        }
    } catch (err) {
        console.log(err.message);
        alert('Network error');
    }
}
