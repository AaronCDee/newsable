const apiKey  = import.meta.env.VITE_CURRENTS_API_KEY
const baseURL = "https://api.currentsapi.services/v1/"

export default class ExternalService {
  constructor(language = "en", region = "US") {
    this.language = language
    this.region   = region
  }

  async getArticles() {
    const res  = await fetch(baseURL + `search?${this.urlParams()}`)
    const data = await res.json()

    if (!res.ok) throw { ...data, error: Error("Error when fetching top headlines") }

    return data.news
  }

  urlParams() {
    const params = new URLSearchParams()
    params.set("apiKey", apiKey)
    params.set("language", this.language)
    params.set("region", this.region)

    return params.toString()
  }
}
