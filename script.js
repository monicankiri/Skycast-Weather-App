console.log("Skycast is starting");

console.log(document.title);

const navigationButtons = document.querySelectorAll(".nav-button");
const screens = document.querySelectorAll(".screen");
const dailyForecastElement = document.getElementById("daily-forecast");
let weatherMap;
let mapWeatherLayer;
function showScreen(targetScreenId) {
screens.forEach(function (screen) {
const isTargetScreen = screen.id === targetScreenId;


    screen.hidden = !isTargetScreen;
    screen.classList.toggle("active", isTargetScreen);
});
if (targetScreenId === "maps-screen" && weatherMap) {
    setTimeout(function () {
        weatherMap.invalidateSize();
    }, 100);
}

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

fetch("https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index,visibility,surface_pressure,dew_point_2m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max&hourly=temperature_2m,weather_code,precipitation_probability,precipitation&forecast_days=10&timezone=Africa%2FLagos")
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
        const hourlyRainfall = data.hourly.precipitation;

        const currentRainfall = data.current.precipitation;

        const dailyRainfall = data.daily.precipitation_sum;

        const dailyRainChance = data.daily.precipitation_probability_max;
        const dailyTimes = data.daily.time;
        const dailyWeatherCodes = data.daily.weather_code;
        const dailyMaxTemperatures = data.daily.temperature_2m_max;
        const dailyMinTemperatures = data.daily.temperature_2m_min;
        
      const currentTime = new Date();

    const startIndex = hourlyTimes.findIndex(function (time) {
        return new Date(time) >= currentTime;
    });
    // Precipitation information
    const precipitationChance = hourlyRainChances[startIndex];

    const expectedRainfall = dailyRainfall[0];

    let rainfallIntensity;

    if (currentRainfall === 0) {
        rainfallIntensity = "No rainfall";
    } else if (currentRainfall < 2) {
        rainfallIntensity = "Light rainfall";
    } else if (currentRainfall < 7) {
        rainfallIntensity = "Moderate rainfall";
    } else {
        rainfallIntensity = "Heavy rainfall";
    }

    // Update precipitation screen
    document.getElementById("precipitation-chance").textContent =
        precipitationChance + "%";

    document.getElementById("expected-rainfall").textContent =
        expectedRainfall + " mm";

    document.getElementById("rainfall-intensity").textContent =
        rainfallIntensity;

    document.getElementById("precipitation-forecast").textContent =
        dailyRainChance[0] > 50
            ? "Rain likely"
            : dailyRainChance[0] > 0
                ? "Low chance of rain"
                : "No rain expected";

    document.getElementById("precipitation-notice").textContent =
        "Today's expected rainfall: " + expectedRainfall + " mm.";

    // HOURLY FORECAST
    if (startIndex === -1) {
        hourlyForecastElement.textContent =
            "No upcoming hourly forecast available.";
    } else {
        hourlyForecastElement.innerHTML = "";

        for (let i = startIndex; i < startIndex + 6; i++) {
            const icon = weatherIcons[hourlyWeatherCodes[i]] || "🌡️";
            const rainChance = hourlyRainChances[i];

            const hour = new Date(hourlyTimes[i]);

            const formattedTime = hour.toLocaleTimeString("en-NG", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });

            const hourlyCard = `
                <div class="hourly-card">
                    <p>${formattedTime}</p>
                    <span>${icon}</span>
                    <h3>${hourlyTemperatures[i]}°C</h3>
                    <p>Rain: ${rainChance}%</p>
                </div>
            `;

            hourlyForecastElement.innerHTML += hourlyCard;
        }
    }

    // 10-DAY FORECAST
    dailyForecastElement.innerHTML = "";

    for (let i = 0; i < dailyTimes.length; i++) {
        const date = new Date(dailyTimes[i] + "T00:00:00");

        const day = date.toLocaleDateString("en-NG", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        const icon = weatherIcons[dailyWeatherCodes[i]] || "🌡️";

        const dailyCard = `
            <div class="daily-card">
                <p>${day}</p>
                <span>${icon}</span>
                <p>H: ${dailyMaxTemperatures[i]}°C</p>
                <p>L: ${dailyMinTemperatures[i]}°C</p>
            </div>
        `;

        dailyForecastElement.innerHTML += dailyCard;
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
        // WEATHER MAP

    const mapElement = document.getElementById("weather-map");
    const mapStatus = document.getElementById("map-status");


    const mapLocations = [
         { name: "Lagos", lat: 6.5244, lon: 3.3792 },
         { name: "Ikeja", lat: 6.6018, lon: 3.3515 },
         { name: "Lekki", lat: 6.4698, lon: 3.5852 },
         { name: "Badagry", lat: 6.4310, lon: 2.8810 },
         { name: "Epe", lat: 6.5841, lon: 3.9834 }
            ];
        
        
    if (mapElement) {
        weatherMap = L.map("weather-map").setView([6.5244, 3.3792], 10);

        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",{
        attribution: "Tiles &copy; Esri"}
        ).addTo(weatherMap);

        L.marker([6.5244, 3.3792])
            .addTo(weatherMap)
            .bindPopup("Lagos, Nigeria")
            .openPopup();
            mapWeatherLayer = L.layerGroup().addTo(weatherMap);
    }
            async function loadMapWeather(layerType) {  
            mapWeatherLayer.clearLayers();

            mapStatus.textContent = "Loading weather data...";
 
            try {
                const results = await Promise.all(
                    mapLocations.map(async function (location) {
                        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,precipitation,wind_speed_10m&timezone=Africa%2FLagos`;

                        const response = await fetch(url);

                        if (!response.ok) {
                            throw new Error("Weather data unavailable");
                        }

                        const data = await response.json();

                        return {
                            location: location,
                            temperature: data.current.temperature_2m,
                            rain: data.current.precipitation,
                            wind: data.current.wind_speed_10m
                        };
                    })
                );

                results.forEach(function (weather) {
                    let value;
                    let label;
                    let color;

                    if (layerType === "temperature") {
                        value = weather.temperature;
                        label = `Temperature: ${value}°C`;
                        color = value >= 30 ? "red" : "orange";
                    } else if (layerType === "rain") {
                        value = weather.rain;
                        label = `Precipitation: ${value} mm`;
                        color = value > 0 ? "blue" : "gray";
                    } else {
                        value = weather.wind;
                        label = `Wind: ${value} km/h`;
                        color = value >= 20 ? "purple" : "green";
                    }

                    L.circleMarker(
                        [weather.location.lat, weather.location.lon],
                        {
                            radius: 12,
                            color: color,
                            fillColor: color,
                            fillOpacity: 0.6
                        }
                    )
                    .bindPopup(`
                        <strong>${weather.location.name}</strong><br>
                        ${label}
                    `)
                    .addTo(mapWeatherLayer);
                });

                mapStatus.textContent =
                    `${layerType} weather data loaded successfully.`;

            } catch (error) {
                mapStatus.textContent =
                    "Unable to load weather data. Please try again.";
                console.error(error);
            }
        }
            function updateMapLegend(layerType) {
            const legend = document.getElementById("map-legend");

            if (layerType === "temperature") {
                legend.innerHTML = `
                    <strong>Temperature</strong>
                    <span><i class="legend-dot orange"></i> Below 30°C</span>
                    <span><i class="legend-dot red"></i> 30°C or above</span>
                `;
            } else if (layerType === "rain") {
                legend.innerHTML = `
                    <strong>Rainfall</strong>
                    <span><i class="legend-dot blue"></i> Rain detected</span>
                    <span><i class="legend-dot gray"></i> No rain detected</span>
                `;
            } else {
                legend.innerHTML = `
                    <strong>Wind Speed</strong>
                    <span><i class="legend-dot purple"></i> 20 km/h or above</span>
                    <span><i class="legend-dot green"></i> Below 20 km/h</span>
                `;
            }
        }
         if (mapWeatherLayer) {
            updateMapLegend("temperature");
            loadMapWeather("temperature");
        }
          


const mapLayerButtons = document.querySelectorAll(".map-layer");

mapLayerButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        mapLayerButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

       const selectedLayer = button.dataset.layer;

        updateMapLegend(selectedLayer);

        if (mapWeatherLayer) {
            loadMapWeather(selectedLayer);
        }
    
    });
});
// SAVED LOCATIONS

const savedCityInput = document.getElementById("saved-city-input");
const saveCityButton = document.getElementById("save-city-button");
const savedLocationsList = document.getElementById("saved-locations-list");
const savedLocationStatus = document.getElementById("saved-location-status");

// Load previously saved cities
let savedLocations = JSON.parse(
    localStorage.getItem("skycastSavedLocations")
) || [];

// Display saved cities
function displaySavedLocations() {
    savedLocationsList.innerHTML = "";

    if (savedLocations.length === 0) {
        savedLocationStatus.textContent = "You have no saved locations yet.";
        return;
    }

    savedLocationStatus.textContent = "Your saved locations:";

    savedLocations.forEach(function (city, index) {
        const cityCard = document.createElement("article");
        cityCard.className = "saved-location-card";

        const cityName = document.createElement("h2");
        cityName.textContent = city;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.type = "button";

        removeButton.addEventListener("click", function () {
            savedLocations.splice(index, 1);

            localStorage.setItem(
                "skycastSavedLocations",
                JSON.stringify(savedLocations)
            );

            displaySavedLocations();
        });

        cityCard.appendChild(cityName);
        cityCard.appendChild(removeButton);

        savedLocationsList.appendChild(cityCard);
    });
}

// Save a new city
saveCityButton.addEventListener("click", function () {
    const city = savedCityInput.value.trim();

    if (city === "") {
        savedLocationStatus.textContent = "Please enter a city name.";
        return;
    }

    const cityExists = savedLocations.some(function (savedCity) {
        return savedCity.toLowerCase() === city.toLowerCase();
    });

    if (cityExists) {
        savedLocationStatus.textContent = "This city is already saved.";
        return;
    }

    savedLocations.push(city);

    localStorage.setItem(
        "skycastSavedLocations",
        JSON.stringify(savedLocations)
    );

    savedCityInput.value = "";

    displaySavedLocations();

    savedLocationStatus.textContent = city + " has been saved.";
});

// Display saved cities when the app opens
displaySavedLocations();

   




