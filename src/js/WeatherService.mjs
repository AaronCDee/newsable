const apiKey      = import.meta.env.VITE_WEATHER_API_KEY
const ipInfoToken = import.meta.env.VITE_IP_INFO_API_TOKEN
const baseURL     = "https://api.openweathermap.org/data/2.5/"
const ipInfoURL   = "https://ipinfo.io/json"

export default class WeatherService {
  async getCurrentWeather() {
    const [lat, lon]              = await this.getLocation()
    const currentWeatherEndpoint  = `weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const res                     = await fetch(baseURL + currentWeatherEndpoint)
    const data                    = await res.json()

    if (!res.ok) throw { ...data, error: Error("Error when fetching top headlines") }

    return data
  }

  async getLocation() {
    try {
      const res  = await fetch(ipInfoURL + `?token=${ipInfoToken}`);
      const data = await res.json();

      return data.loc.split(",");
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  }
}
