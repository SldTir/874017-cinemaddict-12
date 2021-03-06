import FilmView from "../view/film.js";
import PopupView from "../view/popup.js";
import {UserAction, UpdateType} from "../const.js";
import {render, RenderPosition, addElement, removeElement, remove, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export const State = {
  ABORTING: `ABORTING`
};

const siteFooterElement = document.querySelector(`.footer`);

export default class Film {
  constructor(filmListContainer, changeData, changeMode) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlePosterClick = this._handlePosterClick.bind(this);
    this._handleTitleClick = this._handleTitleClick.bind(this);
    this._hendleCommentsClick = this._hendleCommentsClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleSubmitHandler = this._handleSubmitHandler.bind(this);
    this._setViewState = this.setViewState.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmView(film, comments);
    this._popupComponent = new PopupView(film, comments);

    this._filmComponent.setPosterClickHandler(this._handlePosterClick);
    this._filmComponent.setTitleClickHandler(this._handleTitleClick);
    this._filmComponent.setCommentsClickHandler(this._hendleCommentsClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._popupComponent.setCloseClickHandler(this._handleCloseClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._popupComponent.setSubmitHandler(this._handleSubmitHandler);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._filmComponent, prevFilmComponent);
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  setViewState(actionType, idComment) {
    let targetElement;
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        targetElement = this._popupComponent.getCommentFormId(idComment);
        this._popupComponent.shake(targetElement, this._popupComponent.resetComment, idComment);
        break;
      case UserAction.ADD_COMMENT:
        targetElement = this._popupComponent.getSendingForm();
        this._popupComponent.shake(targetElement, this._popupComponent.resetForm);
        break;
    }

  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }

  _addFilmPopup() {
    addElement(siteFooterElement, this._popupComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmPopup();
    }
  }

  _removeFilmPopup() {
    removeElement(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._popupComponent.reset(this._comments);
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
    this._popupComponent.reset(this._comments);
    this._removeFilmPopup();
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MAJOR,
        Object.assign(
            {},
            this._film,
            {
              watchlist: !this._film.watchlist
            }
        ),
        this._comments
    );
  }
  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MAJOR,
        Object.assign(
            {},
            this._film,
            {
              history: !this._film.history,
              watchingDate: new Date(),
            }
        ),
        this._comments
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MAJOR,
        Object.assign(
            {},
            this._film,
            {
              favorites: !this._film.favorites
            }
        ),
        this._comments
    );
  }

  _handleSubmitHandler(newComment) {
    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        this._comments,
        newComment
    );
  }
  _handleDeleteClick(idComment) {
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        this._comments,
        idComment
    );
  }
}
