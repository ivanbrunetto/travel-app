const baseURL = 'http://localhost:8000/api';


export const fetchData = async (endpoint) => {
    try {
        console.log(baseURL + endpoint);
        const response = await fetch(baseURL + endpoint);

        const json = await response.json();
        if (json.error) {
            console.log('Server error message: ', json.message);
            alert('There was a server processing error');
            return;
        }

        return json.data;

    } catch (err) {
        console.log(err.message);
        alert('Network error');
    }
}