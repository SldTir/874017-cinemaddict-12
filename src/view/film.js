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

const createFilmTemplate = (film) => {
  const {name, poster, rating, releaseDate, runtime, genre, description, numberСomments} = film;
  const dateConvert = convertMillisecondsDatePopup(releaseDate);
  const genreUp = genre.join(`, `);
  const date = dateConvert.split(` `)[2];
  const briefDescription = truncatesText(description, MAX_NUMBER_CHARACTERS);

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
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>
  </article>`
  );
};

export default class Film extends AbstractView {
  constructor(film) {
    super();

    this._film = film;

    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentsClickHandler = this._commentsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmTemplate(this._film);
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
}
