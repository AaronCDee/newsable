import ExternalService from "./ExternalService";

export default class ArticlesListing {
  async init() {
    const newsService = new ExternalService
    let articles      = []

    try {
      articles = await newsService.getArticles()
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
}
