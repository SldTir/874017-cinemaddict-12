import {createElement} from "../utils.js";

const createSiteFilter = (films) => {
  const watchlist = films.filter((film) => film.watchlist === true).length;
  const history = films.filter((film) => film.history === true).length;
  const favorites = films.filter((film) => film.favorites === true).length;

  return (
    `<nav class="main-navigation">
     <div class="main-navigation__items">
       <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
       <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
       <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history}</span></a>
       <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
     </div>
     <a href="#stats" class="main-navigation__additional">Stats</a>
   </nav>`
  );
};

export default class Filter {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createSiteFilter(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}