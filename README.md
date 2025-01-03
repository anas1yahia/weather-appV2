# Weather Dashboard Application

A modern, responsive weather dashboard application that provides real-time weather information for countries worldwide.

## Features

- Real-time weather data using WeatherAPI.com
- Country selection from REST Countries API
- Responsive design for mobile, tablet, and desktop
- Dynamic weather icons
- Date selection functionality
- Current location detection



#Project Structure


weather-app/
│
├── index.html
├── style.css
├── script.js
└── README.md



## Technologies Used

- HTML5
- CSS3 (Flexbox, CSS Grid, Media Queries)
- JavaScript (ES6+)
- APIs:
  - WeatherAPI.com
  - REST Countries API
- Libraries:
  - Remix Icons
  - Flatpickr for date picking

## Setup

1. Clone the repository:
```bash
git clone [[your-repo-url]](https://github.com/anas1yahia/weather-appV2)

Navigate to project directory:
cd weather-app

Add your API keys:
Get API key from WeatherAPI.com
Update script.js with your API key:
const API_KEY = 'your_api_key_here';


API Documentation
WeatherAPI.com
Endpoint: https://api.weatherapi.com/v1/current.json
Parameters:
key: Your API key
q: Location name
REST Countries API
Endpoint: https://restcountries.com/v3.1/all
No authentication required
Usage
Select a country from the dropdown
Click "Get Weather" to fetch current weather
View weather details including:
Temperature
Weather condition
Location information

