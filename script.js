// Constants
const API_URL = 'https://restcountries.com/v3.1/all';

const DEFAULT_OPTION = '<option value="">Select a country</option>';
const ERROR_OPTION = '<option value="">Error loading countries</option>';

// DOM Elements
const countrySelect = document.getElementById('countrySelect');
const locationSpan = document.querySelector('#location span:last-child');
const locationBtn = document.getElementById('getLocation');

// Utility Functions
const setLoading = (isLoading) => {
    countrySelect.disabled = isLoading;
};

const updateLocation = (countryName, countryCode) => {
    locationSpan.textContent = countryCode ? 
        `${countryName}, ${countryCode}` : 
        'Select a country';
};

const sortCountries = (countries) => {
    return [...countries].sort((a, b) => 
        a.name.common.localeCompare(b.name.common)
    );
};

// Main Functions
async function fetchCountries() {
    const response = await fetch(API_URL);
    return response.json();
}

function createOptionsString(countries) {
    return countries.reduce((options, country) => 
        options + `<option value="${country.cca2}">${country.name.common}</option>`, 
        DEFAULT_OPTION
    );
}

async function initializeCountrySelect() {
    try {
        setLoading(true);
        const countries = await fetchCountries();
        const sortedCountries = sortCountries(countries);
        countrySelect.innerHTML = createOptionsString(sortedCountries);
    } catch (error) {
        console.error('Failed to fetch countries:', error);
        countrySelect.innerHTML = ERROR_OPTION;
    } finally {
        setLoading(false);
    }
}

function handleCountryChange(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    updateLocation(
        selectedOption.text,
        selectedOption.value
    );
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeCountrySelect);
countrySelect.addEventListener('change', handleCountryChange);



async function reverseGeocode(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url, {
        headers: {
            'Accept-Language': 'en-US',
            'User-Agent': 'WeatherApp/1.0'
        }
    });
    return response.json();
}

locationBtn.addEventListener('click', () => {
    const success = async (position) => {
        try {
            locationBtn.disabled = true;
            locationSpan.textContent = 'Getting location...';

            const { latitude, longitude } = position.coords;
            const geoData = await reverseGeocode(latitude, longitude);

            if (geoData.address && geoData.address.country) {
                const countryName = geoData.address.country;
                const countryCode = geoData.address.country_code.toUpperCase();
                locationSpan.textContent = `${countryName}, ${countryCode}`;
            } else {
                locationSpan.textContent = 'Location not found';
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            locationSpan.textContent = 'Failed to fetch location details';
        } finally {
            locationBtn.disabled = false;
        }
    };

    const error = (error) => {
        console.error('Geolocation error:', error);
        locationSpan.textContent = 'Failed to get location';
        locationBtn.disabled = false;
    };

    navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });
});



document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#calander", {
        inline: true, // Always show calendar
        dateFormat: "Y-m-d",
        maxDate: "today",
        defaultDate: "today",
        animate: true,
        onChange: function(_selectedDates, dateStr) {
            console.log("Selected date:", dateStr);
        }
    });
});




/*date picker*/

document.addEventListener('DOMContentLoaded', function() {
    const dayTitle = document.querySelector('#day h1');
    const dayDate = document.querySelector('#day p');

    flatpickr("#calander", {
        inline: true,
        dateFormat: "Y-m-d",
        maxDate: "today",
        defaultDate: "today",
        onChange: function(selectedDates) {
            const date = selectedDates[0];
            
            // Format day name
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            // Format date
            const formattedDate = date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            // Update DOM
            dayTitle.textContent = dayName;
            dayDate.textContent = formattedDate;
        }
    });
});




/*get weather*/




document.addEventListener('DOMContentLoaded', async function() {
    // API Configuration
    const API_KEY = 'e47b81413f8b446ab7a233736242712'; 
    const API_URL = 'https://api.weatherapi.com/v1/current.json';
    const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all';

    // Weather Icons Mapping
    const weatherIcons = {
        'Sunny': 'ri-sun-line',
        'Clear': 'ri-sun-line',
        'Partly cloudy': 'ri-cloudy-line',
        'Cloudy': 'ri-cloudy-line',
        'Overcast': 'ri-cloudy-line',
        'Rain': 'ri-rainy-line',
        'Light rain': 'ri-drizzle-line',
        'Moderate rain': 'ri-rainy-line',
        'Heavy rain': 'ri-heavy-showers-line',
        'Snow': 'ri-snowy-line',
        'Light snow': 'ri-snowy-line',
        'Heavy snow': 'ri-snowy-line',
        'Thunderstorm': 'ri-thunderstorms-line',
        'Mist': 'ri-mist-line',
        'Fog': 'ri-mist-line'
    };

    async function getWeather(location) {
        try {
            const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(location)}`;
            console.log('Fetching weather from:', url);
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return {
                temp: data.current.temp_c,
                condition: data.current.condition.text,
                icon: weatherIcons[data.current.condition.text] || 'ri-sun-line',
                location: `${data.location.name}, ${data.location.country}`
            };
        } catch (error) {
            console.error('Weather API Error:', error);
            throw error;
        }
    }

    document.querySelector('.submit-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        const submitBtn = e.target;
        const countrySelect = document.querySelector('#countrySelect');

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Loading...';

            if (!countrySelect || !countrySelect.value) {
                throw new Error('Please select a country');
            }

            const countryName = countrySelect.options[countrySelect.selectedIndex].text;
            const weatherData = await getWeather(countryName);
            
            const elements = {
                weatherIcon: document.querySelector('#weather i'),
                temperature: document.querySelector('#temperature h1'),
                weatherStatus: document.querySelector('#temperature p'),
                location: document.querySelector('.location span:last-child')
            };

            elements.temperature.textContent = `${Math.round(weatherData.temp)}°C`;
            elements.weatherStatus.textContent = weatherData.condition;
            elements.weatherIcon.className = weatherData.icon;
            elements.location.textContent = weatherData.location;

        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Get Weather';
        }
    });

    // Initialize countries dropdown
    try {
        const response = await fetch(COUNTRIES_API_URL);
        const countries = await response.json();
        const countrySelect = document.querySelector('#countrySelect');
        
        countries
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .forEach(country => {
                const option = document.createElement('option');
                option.value = country.cca2;
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            });
    } catch (error) {
        console.error('Error loading countries:', error);
        alert('Failed to load countries list');
    }
});