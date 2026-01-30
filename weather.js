const API_KEY = "f48ab05bcddb73f0644826efe5c587b3";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

async function getWeather() {
  const city = document.getElementById("location").value.trim();

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  try {
    // Current weather
    const currentResponse = await fetch(
      `${CURRENT_URL}?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!currentResponse.ok) {
      throw new Error("City not found");
    }

    const currentData = await currentResponse.json();
    displayCurrentWeather(currentData);

    // 5-day forecast
    const forecastResponse = await fetch(
      `${FORECAST_URL}?q=${city}&units=metric&appid=${API_KEY}`
    );

    const forecastData = await forecastResponse.json();
    displayForecast(forecastData);

  } catch (error) {
    showError(error.message);
  }
}

function displayCurrentWeather(data) {
  document.getElementById("weatherBox").style.display = "block";

  document.getElementById("city").innerText =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temp").innerText =
    Math.round(data.main.temp) + "°C";

  document.getElementById("desc").innerText =
    data.weather[0].description;

  document.getElementById("humidity").innerText =
    "Humidity: " + data.main.humidity + "%";

  document.getElementById("wind").innerText =
    "Wind: " + data.wind.speed + " m/s";

  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  const dailyForecasts = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyForecasts.forEach(item => {
    const date = new Date(item.dt_txt).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });

    const div = document.createElement("div");
    div.className = "forecast-item";

    div.innerHTML = `
      <p>${date}</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
      <p>${Math.round(item.main.temp)}°C</p>
    `;

    forecastContainer.appendChild(div);
  });
}

function showError(message) {
  document.getElementById("weatherBox").style.display = "block";
  document.getElementById("city").innerText = "Error";
  document.getElementById("temp").innerText = "";
  document.getElementById("desc").innerText = message;
  document.getElementById("humidity").innerText = "";
  document.getElementById("wind").innerText = "";
  document.getElementById("icon").src = "";
  document.getElementById("forecast").innerHTML = "";
}
