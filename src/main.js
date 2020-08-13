import UserMenuView from "./view/user-menu.js";
import SiteFilter from "./view/filter.js";
import SortView from "./view/sort.js";
import FilmsContainerView from "./view/films-container.js";
import FilmView from "./view/film.js";
import PopupView from "./view/popup.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import NoFilmView from "./view/no-film.js";
import {generateFilm} from "./mock/film.js";
import {render, RenderPosition} from "./utils.js";

const FILM_COUNT = 18;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const renderFilm = (container, film) => {
  const filmComponent = new FilmView(film).getElement();
  const filmPopupComponent = new PopupView(film).getElement();

  const addFilmPopup = () => {
    siteFooterElement.appendChild(filmPopupComponent);
  };

  const removeFilmPopup = () => {
    siteFooterElement.removeChild(filmPopupComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      removeFilmPopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  filmComponent.querySelector(`.film-card__poster`).addEventListener(`click`, () => {
    addFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmComponent.querySelector(`.film-card__title`).addEventListener(`click`, () => {
    addFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmComponent.querySelector(`.film-card__comments`).addEventListener(`click`, () => {
    addFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmPopupComponent.querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
    removeFilmPopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, filmComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardFilms) => {
  const filmsContainerComponent = new FilmsContainerView();
  render(boardContainer, filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

  const siteFilmsListContainer = boardContainer.querySelector(`.films-list__container`);
  const siteFilmList = boardContainer.querySelector(`.films-list`);

  if (boardFilms.length === 0) {
    siteFilmList.innerHTML = ``;
    render(siteFilmList, new NoFilmView().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  boardFilms
    .slice(0, Math.min(boardFilms.length, FILM_COUNT_PER_STEP))
    .forEach((boardFilm) => renderFilm(siteFilmsListContainer, boardFilm));

  if (boardFilms.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(filmsContainerComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      boardFilms
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(siteFilmsListContainer, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= boardFilms.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }
};

render(siteHeaderElement, new UserMenuView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteFilter(films).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
renderBoard(siteMainElement, films);
