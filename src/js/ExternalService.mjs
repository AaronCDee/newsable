const apiKey  = import.meta.env.VITE_NEWS_API_KEY
const baseURL = "https://newsapi.org/v2/"

export default class ExternalService {
  constructor(country = "us") {
    this.country = country
  }
  async getTopHeadlines() {
    const res  = await fetch(baseURL + `top-headlines?${this.urlParams()}`, { headers: this.headers(), mode: "no-cors" })
    const data = await res.json()

    if (!res.ok) throw { ...data, error: Error("Error when fetching top headlines") }

    return data.articles
  }

  urlParams() {
    const params = new URLSearchParams()
    params.set("country", this.country)

    return params.toString()
  }

  headers() {
    return {
      "x-api-key": apiKey
    }
  }
}
