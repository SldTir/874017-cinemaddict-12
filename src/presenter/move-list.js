import BoardView from "../view/board.js";
import NoFilmView from "../view/no-film.js";
import SortView from "../view/sort.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmPresenter from "./film.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortFilmDate, sortFilmRating} from "../utils/film.js";
import {SortType, UpdateType, UserAction} from "../const.js";

const FILM_COUNT_PER_STEP = 5;

export default class MoveList {
  constructor(boardContainer, filmsModel, commentsModel) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._boardComponent = new BoardView();
    this._noFilmComponent = new NoFilmView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortFilmDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortFilmRating);
    }
    return this._filmsModel.getFilms();
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  _handleModelChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_FILM:
        this._filmsModel.addFilm(updateType, update);
        break;
      case UserAction.DELETE_FILM:
        this._filmsModel.deleteFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilm(container, film, comment) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModelChange);
    filmPresenter.init(film, comment);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(container, films, comments) {
    films.forEach((film, index) => this._renderFilm(container, film, comments[index]));
  }

  _renderNoFilm(container) {
    render(container, this._noFilmComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    const siteFilmsListContainer = this._boardContainer.querySelector(`.films-list__container`);

    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);
    const comments = this._getComments();

    this._renderFilms(siteFilmsListContainer, films, comments);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._boardComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
  }

  _renderFilmList(siteFilmsListContainer) {
    const filmCout = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCout, FILM_COUNT_PER_STEP));

    this._renderFilms(siteFilmsListContainer, films, this._getComments());
  }

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    const siteFilmsListContainer = this._boardContainer.querySelector(`.films-list__container`);
    const siteFilmList = this._boardContainer.querySelector(`.films-list`);
    const films = this._getFilms();
    const filmCount = films.length;
    const comments = this._getComments();

    if (this._getFilms().length === 0) {
      siteFilmList.innerHTML = ``;
      this._renderNoFilm(siteFilmList);
      return;
    }

    this._renderSort();

    this._renderFilms(siteFilmsListContainer, films.slice(0, Math.min(filmCount, this._renderedFilmCount)), comments);

    if (this._getFilms().length > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }
  }
}
