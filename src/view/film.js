import AbstractView from "./abstract.js";
import {convertMillisecondsDatePopup} from "../utils/film.js";

const MAX_NUMBER_CHARACTERS = 139;

const truncatesText = (text, limit) => {
  const textNumbers = text.length;
  if (textNumbers <= limit) {
    return text;
  }
  const briefDescription = text.slice(0, limit) + `...`;

  return briefDescription;
};

const createFilmCardControlsTemplate = (watchlist, history, favorites) => {
  const watchlistClass = watchlist ? `film-card__controls-item--active` : ``;
  const watchedClass = history ? `film-card__controls-item--active` : ``;
  const favoritesClass = favorites ? `film-card__controls-item--active` : ``;

  return (
    `<form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClass}" >Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClass}">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${favoritesClass}">Mark as favorite</button>
  </form>`
  );
};

const createFilmTemplate = (film, comments) => {
  const {watchlist, history, favorites, name, poster, rating, releaseDate, runtime, genre, description} = film;
  const dateConvert = convertMillisecondsDatePopup(releaseDate);
  const genreUp = genre.join(`, `);
  const date = dateConvert.split(` `)[2];
  const briefDescription = truncatesText(description, MAX_NUMBER_CHARACTERS);
  const filmCardControlsTemplate = createFilmCardControlsTemplate(watchlist, history, favorites);
  const numberСomments = comments.comments.length;

  return (
    `<article class="film-card">
    <h3 class="film-card__title">${name}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${date}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genreUp}</span>
    </p>
    <img src="./images/posters/${poster}" alt="${name}" class="film-card__poster">
    <p class="film-card__description">${briefDescription}</p>
    <a class="film-card__comments">${numberСomments} comments</a>
    ${filmCardControlsTemplate}
  </article>`
  );
};

export default class Film extends AbstractView {
  constructor(film, comments) {
    super();

    this._film = film;
    this._comments = comments;

    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentsClickHandler = this._commentsClickHandler.bind(this);
    this._watchlistCickHandler = this._watchlistCickHandler.bind(this);
    this._watchedCickHandler = this._watchedCickHandler.bind(this);
    this._favoriteCickHandler = this._favoriteCickHandler.bind(this);
  }

  getTemplate() {
    return createFilmTemplate(this._film, this._comments);
  }

  _posterClickHandler(evt) {
    evt.preventDefault();
    this._callback.posterClick();
  }

  setPosterClickHandler(callback) {
    this._callback.posterClick = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._posterClickHandler);
  }

  _titleClickHandler(evt) {
    evt.preventDefault();
    this._callback.titleClick();
  }

  setTitleClickHandler(callback) {
    this._callback.titleClick = callback;
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._titleClickHandler);
  }

  _commentsClickHandler(evt) {
    evt.preventDefault();
    this._callback.commentsClick();
  }

  setCommentsClickHandler(callback) {
    this._callback.commentsClick = callback;
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._commentsClickHandler);
  }

  _watchlistCickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistCickHandler);
  }

  _watchedCickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedCickHandler);
  }

  _favoriteCickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteCickHandler);
  }
}
