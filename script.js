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

fetch("https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current=temperature_2m,weather_code&timezone=Africa%2FLagos")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const currentTemperature = data.current.temperature_2m;
        temperatureElement.textContent = `${currentTemperature}°C`;

        const weatherCode = data.current.weather_code;

        console.log(weatherCode);
        const condition = weatherConditions[weatherCode] || "Unknown weather condition";

        weatherDescription.textContent = condition;
        const icon = weatherIcons[weatherCode] || "🌡️";
        weatherIcon.textContent = icon;
        });




