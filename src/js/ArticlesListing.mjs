import NewsService from "./NewsService";

export default class ArticlesListing {
  async init() {
    this.searchInput  = document.querySelector(".search-input")
    this.searchButton = document.getElementById("search-button")

    this.searchButton.addEventListener("click", this.handleSearch.bind(this))

    this.newsService = new NewsService
    let articles     = []

    try {
      articles = await this.newsService.getArticles()
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      this.renderError(error.message)

      return
    }

    this.renderArticles(this.filterArticles(articles))
    this.renderRecentSearches()
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

  addToRecentSearches(query) {
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || []

    if (!recentSearches.includes(query)) {
      recentSearches.push(query)
    }

    localStorage.setItem("recentSearches", JSON.stringify(recentSearches))

    this.renderRecentSearches()
  }

  renderRecentSearches() {
    const recentSearchesContainer = document.querySelector(".recent-searches-container");
    const recentSearchTerms       = document.querySelector(".recent-search-terms");
    const recentSearches          = JSON.parse(localStorage.getItem("recentSearches")) || [];

    if (recentSearches.length === 0) return;

    recentSearchesContainer.classList.remove("hidden")
    recentSearchTerms.innerHTML = "";
    const html                  = recentSearches.map(query => this.recentSearchTemplate(query)).join("");
    recentSearchTerms.insertAdjacentHTML("afterbegin", html);

    const recentSearchElements = document.querySelectorAll(".recent-search");
    recentSearchElements.forEach(recentSearchEl => {
      recentSearchEl.addEventListener("click", this.handleRecentSearchClick.bind(this))
    })
  }

  handleRecentSearchClick(e) {
    const query = e.target.innerText
    this.searchInput.value = query

    this.handleSearch()
  }

  recentSearchTemplate(query) {
    return `<a class="recent-search">${query}</a>`;
  }

  async handleSearch() {
    const query = this.searchInput.value

    if (query === "" || query === null || query === undefined) return

    this.addToRecentSearches(query)

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
