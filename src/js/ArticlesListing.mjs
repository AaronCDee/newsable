import ExternalService from "./ExternalService";

export default class ArticlesListing {
  async init() {
    this.searchInput  = document.querySelector(".search-input")
    this.searchButton = document.getElementById("search-button")

    this.searchButton.addEventListener("click", this.handleSearch.bind(this))

    this.newsService = new ExternalService
    let articles     = []

    try {
      articles = await this.newsService.getArticles()
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      this.renderError(error.message)

      return
    }

    this.renderArticles(this.filterArticles(articles))
  }

  filterArticles(articles) {
    return articles.filter(article => article.content !== null && article.content !== "")
  }

  template(article) {
    return `
      <div class="article-card">
        <h1 class="headline text">${article.title}</h1>
        <p class="date">
          Published on February 8, 2025 by ${article.author === null || article.author === "" ? "Anonymous" : article.author}
        </p>
        <p class="content text">${article.description}</p>
        <a href="${article.url}" target="_blank" class="read-more">Read More →</a>
        <div class="socials">
          <a href="http://twitter.com/share?text=Check out this article from Newsable: ${article.url}">
            <img src="/images/x-icon.svg" />
          </a>
        </div>
      </div>
    `
  }

  renderArticles(articles) {
    const articlesHTML = articles.map(article => this.template(article)).join("")

    this.container().insertAdjacentHTML("afterbegin", articlesHTML)
  }

  container() {
    return document.querySelector(".articles-container")
  }

  renderError(error) {
    this.container().insertAdjacentHTML("afterbegin", `There was an error loading articles: ${error}`)
  }

  async handleSearch() {
    const query = this.searchInput.value

    if (query === "" || query === null || query === undefined) return

    let articles = []

    try {
      articles = await this.newsService.searchArticles(query)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      this.renderError(error.message)

      return
    }

    this.renderArticles(articles)
  }
}
