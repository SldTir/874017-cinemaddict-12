import BoardView from "../view/board.js";
import NoFilmView from "../view/no-film.js";
import SortView from "../view/sort.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmPresenter from "./film.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortFilmDate, sortFilmRating} from "../utils/film.js";
import {SortType} from "../const.js";

const FILM_COUNT_PER_STEP = 5;

export default class MoveList {
  constructor(boardContainer, filmsModel, commentsModel) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._boardComponent = new BoardView();
    this._noFilmComponent = new NoFilmView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSort();
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
    console.log(actionType, updateType, update);
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList();
    this._renderBoard();
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
    render(this._boardComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
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

  _renderBoard() {
    const siteFilmsListContainer = this._boardContainer.querySelector(`.films-list__container`);
    const siteFilmList = this._boardContainer.querySelector(`.films-list`);
    if (this._getFilms().length === 0) {
      siteFilmList.innerHTML = ``;
      this._renderNoFilm(siteFilmList);
      return;
    }

    this._renderFilmList(siteFilmsListContainer);

    if (this._getFilms().length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
}
