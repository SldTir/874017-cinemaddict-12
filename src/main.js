import UserMenuView from "./view/user-menu.js";
import SiteFilter from "./view/filter.js";
import SortView from "./view/sort.js";
import FilmsContainerView from "./view/films-container.js";
import FilmView from "./view/film.js";
import PopupView from "./view/popup.js";
import SchowMoreButtonView from "./view/show-more-button.js";
import {generateFilm} from "./mock/film.js";
import {render, RenderPosition} from "./utils.js";

const FILM_COUNT = 18;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const renderFilm = (container, film) => {
  const filmComponent = new FilmView(film);
  const filmPopupComponent = new PopupView(film);

  const addFilmPopup = () => {
    siteFooterElement.appendChild(filmPopupComponent.getElement());
  };

  const removeFilmPopup = () => {
    filmPopupComponent.getElement().remove();
  };

  filmComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => {
    addFilmPopup();
  });

  filmComponent.getElement().querySelector(`.film-card__title`).addEventListener(`click`, () => {
    addFilmPopup();
  });

  filmComponent.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, () => {
    addFilmPopup();
  });

  filmPopupComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
    removeFilmPopup();
  });

  render(container, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new UserMenuView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteFilter(films).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const filmsContainerComponent = new FilmsContainerView();
render(siteMainElement, filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

const siteFilmsListContainer = siteMainElement.querySelector(`.films-list__container`);
for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilm(siteFilmsListContainer, films[i]);
}

// render(siteFooterElement, new PopupView(films[0]).getElement(), RenderPosition.AFTERBEGIN);

if (films.length > FILM_COUNT_PER_STEP) {
  const schowMoreButtonComponent = new SchowMoreButtonView();
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmsContainerComponent.getElement(), schowMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  schowMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilm(siteFilmsListContainer, film));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      schowMoreButtonComponent.getElement().remove();
      schowMoreButtonComponent.removeElement();
    }
  });
}
