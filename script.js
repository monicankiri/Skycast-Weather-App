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
weatherDescription.textContent = "Partly Cloudy";

const weatherData = {
    city: "Lagos",
    temperature: 30,
    condition: "Partly cloudy"
};

const temperatureElement = document.getElementById("temperature");
temperatureElement.textContent = `${weatherData.temperature}°`;
let weatherCode;

fetch("https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current=temperature_2m,weather_code&timezone=Africa%2FLagos")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const currentTemperature = data.current.temperature_2m;
        weatherCode = data.current.weather_code;

        console.log(weatherCode);
        if (weatherCode === 53) {
            weatherDescription.textContent = "Moderate Drizzle";
        }
        else if (weatherCode === 61) {
            weatherDescription.textContent = "Slight Rain";
        }
        else if (weatherCode === 0) {
            weatherDescription.textContent = "Clear Sky";
        }
       else if (weatherCode === 1) {
            weatherDescription.textContent = "Mainly Clear";
        }   
        else if (weatherCode === 2) {
            weatherDescription.textContent = "Partly Cloudy";
        }
        else if (weatherCode === 3) {
            weatherDescription.textContent = "Overcast";
        }
        else {
            weatherDescription.textContent = "Unknown weather condition";
        }
        temperatureElement.textContent = `${currentTemperature}°`;
    });



