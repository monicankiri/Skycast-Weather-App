console.log("Skycast is starting");

console.log(document.title);

const navigationButtons = document.querySelectorAll(".nav-button");
const screens = document.querySelectorAll(".screen");

function showScreen(targetScreenId) {
screens.forEach(function (screen) {
const isTargetScreen = screen.id === targetScreenId;


    screen.hidden = !isTargetScreen;
    screen.classList.toggle("active", isTargetScreen);
});

navigationButtons.forEach(function (button) {
    const isTargetButton = button.dataset.screen === targetScreenId;

    button.classList.toggle("active", isTargetButton);

    if (isTargetButton) {
        button.setAttribute("aria-current", "page");
    } else {
        button.removeAttribute("aria-current");
    }
});
}

const screenTriggers = document.querySelectorAll("[data-screen]");
screenTriggers.forEach(function (button) {
    button.addEventListener("click", function () {
        showScreen(button.dataset.screen);
    });
});

const locationElement = document.getElementById("location-name");
locationElement.textContent ="lagos, Nigeria";

const weatherDescription = document.getElementById("weather-description");
const temperatureElement = document.getElementById("temperature");
const feelsLikeElement = document.getElementById("feels-like");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const uvIndexElement = document.getElementById("uv-index");
const visibilityElement = document.getElementById("visibility");
const pressureElement = document.getElementById("pressure");
const dewPointElement = document.getElementById("dew-point");
const sunriseElement = document.getElementById("sunrise");
const sunsetElement = document.getElementById("sunset");
const hourlyForecastElement = document.getElementById("hourly-forecast");

const highTemperatureElement = document.getElementById("high-temperature");
const lowTemperatureElement = document.getElementById("low-temperature");
let weatherCode;
const weatherIcon = document.getElementById("weather-icon");

const weatherConditions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    53: "Moderate Drizzle",
    61: "Slight Rain"
};
const weatherIcons = {
    0:  "☀️",
    1:	"🌤️",
    2:	"⛅",
    3:	"☁️",
    53: "🌦️",
    61:	"🌧️"
};

fetch("https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index,visibility,surface_pressure,dew_point_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,weather_code,precipitation_probability&timezone=Africa%2FLagos")  
 .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const currentTemperature = data.current.temperature_2m;
        const apparentTemperature = data.current.apparent_temperature;
        const relativeHumidity = data.current.relative_humidity_2m;
        const windSpeed = data.current.wind_speed_10m;
        const uvIndex = data.current.uv_index;
        const visibility = data.current.visibility;
        const visibilityInKm = visibility / 1000;
        const pressure = data.current.surface_pressure;
        const dewPoint = data.current.dew_point_2m;
        const sunrise = data.daily.sunrise[0];
        const sunset = data.daily.sunset[0];
        
        const hourlyTimes = data.hourly.time;
        const hourlyTemperatures = data.hourly.temperature_2m;
        const hourlyWeatherCodes = data.hourly.weather_code;
        const hourlyRainChances = data.hourly.precipitation_probability;
        
        
        
        hourlyForecastElement.innerHTML = "";
        for (let i = 0; i < 6; i++) {
            console.log(hourlyTimes[i]);
            console.log(hourlyTemperatures[i]);
            console.log(hourlyWeatherCodes[i]);
            const icon = weatherIcons[hourlyWeatherCodes[i]] || "🌡️";
            
            const hourlyCard = `
                <div class="hourly-card">
                    <p>${hourlyTimes[i]}</p>
                    <span>${icon}</span>
                    <h3>${hourlyTemperatures[i]}°C</h3>
                </div>
            `;
            
            hourlyForecastElement.innerHTML += hourlyCard;
            console.log(icon);
        }

        temperatureElement.textContent = `${currentTemperature}°C`;
        feelsLikeElement.textContent = `Feels like ${apparentTemperature}°C`;
        humidityElement.textContent = `Humidity: ${relativeHumidity}%`;
        windSpeedElement.textContent = `Wind Speed: ${windSpeed} km/h`;
        pressureElement.textContent = `Pressure: ${pressure} hPa`;
        visibilityElement.textContent = `Visibility: ${visibilityInKm.toFixed(2)} km`;
        uvIndexElement.textContent = `UV Index: ${uvIndex}`;
        dewPointElement.textContent = `Dew Point: ${dewPoint}°C`;
        sunriseElement.textContent = sunrise;
        sunsetElement.textContent = sunset;
        const weatherCode = data.current.weather_code;
        const highestTemperature = data.daily.temperature_2m_max[0];
        const lowestTemperature = data.daily.temperature_2m_min[0];
        highTemperatureElement.textContent = `H: ${highestTemperature}°C`;
        lowTemperatureElement.textContent = `L: ${lowestTemperature}°C`;

        console.log(weatherCode);
        const condition = weatherConditions[weatherCode] || "Unknown weather condition";

        weatherDescription.textContent = condition;
        const icon = weatherIcons[weatherCode] || "🌡️";
        weatherIcon.textContent = icon;
        });
        




