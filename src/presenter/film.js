import FilmView from "../view/film.js";
import PopupView from "../view/popup.js";
import {render, RenderPosition, addElement, removeElement} from "../utils/render.js";

const siteFooterElement = document.querySelector(`.footer`);

export default class Film {
  constructor(filmListContainer) {
    this._filmListContainer = filmListContainer;

    this._filmComponent = null;
    this._popupComponent = null;

    this._handlePosterClick = this._handlePosterClick.bind(this);
    this._handleTitleClick = this._handleTitleClick.bind(this);
    this._hendleCommentsClick = this._hendleCommentsClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmComponent = new FilmView(film);
    this._popupComponent = new PopupView(film);

    this._filmComponent.setPosterClickHandler(this._handlePosterClick);
    this._filmComponent.setTitleClickHandler(this._handleTitleClick);
    this._filmComponent.setCommentsClickHandler(this._hendleCommentsClick);
    this._popupComponent.setCloseClickHandler(this._handleCloseClick);

    render(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
  }

  _addFilmPopup() {
    addElement(siteFooterElement, this._popupComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _removeFilmPopup() {
    removeElement(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._removeFilmPopup();
    }
  }

  _handlePosterClick() {
    this._addFilmPopup();
  }

  _handleTitleClick() {
    this._addFilmPopup();
  }

  _hendleCommentsClick() {
    this._addFilmPopup();
  }

  _handleCloseClick() {
    this._removeFilmPopup();
  }
}
