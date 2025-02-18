import WeatherService from "./WeatherService.mjs";

export default class Weather {
  async init() {
    this.weatherModalOpenBtn  = document.querySelector(".weather-modal-btn")
    this.weatherModalCloseBtn = document.querySelector(".weather-modal-close-btn")
    this.weatherModalOverlay  = document.querySelector(".weather-modal-overlay")

    this.weatherModalOverlay.addEventListener("click", this.closeModal.bind(this))
    this.weatherModalCloseBtn.addEventListener("click", this.closeModal.bind(this))
    this.weatherModalOpenBtn.addEventListener("click", this.openModal.bind(this))

    const weatherService = new WeatherService();
    let weather          = {};
    try{
      weather = await weatherService.getCurrentWeather();
    } catch (error) {
      console.error(error)
      this.renderError();

      return;
    }

    this.weatherModalOpenBtn.insertAdjacentHTML("afterbegin", this.btnTemplate(weather))
    this.container().insertAdjacentHTML("afterbegin", this.template(weather));
  }

  btnTemplate(data) {
    const { weather } = data;
    const iconUrl     = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    return `<img src="${iconUrl}" alt="${weather[0].description}" class="weather-icon" />`;
  }

  renderError() {
    this.container().insertAdjacentHTML("afterbegin", "Couldn't fetch weather for your location...");
  }

  template(data) {
    const { name, main, weather, wind, sys, rain, clouds } = data;
    const iconUrl                                          = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    return `
      <h2>Weather in ${name}, ${sys.country}</h2>
      <img src="${iconUrl}" alt="${weather[0].description}" class="weather-icon" />
      <p><strong>Temperature:</strong> ${main.temp}°F (Feels like ${main.feels_like}°F)</p>
      <p><strong>Min Temp:</strong> ${main.temp_min}°F | <strong>Max Temp:</strong> ${main.temp_max}°F</p>
      <p><strong>Humidity:</strong> ${main.humidity}% | <strong>Pressure:</strong> ${main.pressure} hPa</p>
      <p><strong>Wind:</strong> ${wind.speed} mph, Gust: ${wind.gust} mph, Direction: ${wind.deg}°</p>
      <p><strong>Cloud Cover:</strong> ${clouds.all}%</p>
      <p><strong>Rain (Last Hour):</strong> ${rain?.["1h"] ? rain["1h"] + " mm" : "No rain"}</p>
      <p><strong>Sunrise:</strong> ${new Date(sys.sunrise * 1000).toLocaleTimeString()}</p>
      <p><strong>Sunset:</strong> ${new Date(sys.sunset * 1000).toLocaleTimeString()}</p>
    `;
  }

  container() {
    return document.querySelector(".weather-container");
  }

  closeModal() {
    this.weatherModalOverlay.classList.remove("show-weather-modal")
  }

  openModal() {
    this.weatherModalOverlay.classList.add("show-weather-modal")
  }
}
