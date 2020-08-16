import BoardView from "../view/board.js";
import FilterView from "../view/filter.js";
import SortView from "../view/sort.js";
import FilmView from "../view/film.js";
import PopupView from "../view/popup.js";
import NoFilmView from "../view/no-film.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import {render, RenderPosition, addElement, removeElement, remove} from "../utils/render.js";


const FILM_COUNT_PER_STEP = 5;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._filterComponent = new FilterView();
    this._sortComponent = new SortView();
    this._boardComponent = new BoardView();
    this._noFilmComponent = new NoFilmView();
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderFilm(container, film) {
    const siteFooterElement = document.querySelector(`.footer`);

    const filmComponent = new FilmView(film);
    const filmPopupComponent = new PopupView(film);

    const addFilmPopup = () => {
      addElement(siteFooterElement, filmPopupComponent);
    };

    const removeFilmPopup = () => {
      removeElement(filmPopupComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        removeFilmPopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    filmComponent.setPosterClickHandler(() => {
      addFilmPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    filmComponent.setTitleClickHandler(() => {
      addFilmPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    filmComponent.setCommentsClickHandler(() => {
      addFilmPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    filmPopupComponent.setCloseClickHandler(() => {
      removeFilmPopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(container, filmComponent, RenderPosition.BEFOREEND);
  }

  _renderFilms(container, from, to) {
    this._boardFilms
    .slice(from, to)
    .forEach((boardFilm) => this._renderFilm(container, boardFilm));
  }

  _renderNoFilm(container) {
    render(container, this._noFilmComponent, RenderPosition.AFTERBEGIN);
  }

  _renderShowMoreButton(container) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(this._boardComponent, showMoreButtonComponent, RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {

      this._boardFilms
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => this._renderFilm(container, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= this._boardFilms.length) {
        remove(showMoreButtonComponent);
      }
    });
  }

  _renderBoard() {
    const siteFilmsListContainer = this._boardContainer.querySelector(`.films-list__container`);
    const siteFilmList = this._boardContainer.querySelector(`.films-list`);

    if (this._boardFilms.length === 0) {
      siteFilmList.innerHTML = ``;
      this._renderNoFilm(siteFilmList);
      return;
    }

    this._renderFilms(siteFilmsListContainer, 0, Math.min(this._boardFilms.length, FILM_COUNT_PER_STEP));

    if (this._boardFilms.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton(siteFilmsListContainer);
    }
  }
}
