import UserMenuView from "./view/user-menu.js";
import SiteFilter from "./view/filter.js";
import SortView from "./view/sort.js";
import FilmsContainerView from "./view/films-container.js";
import {createSiteFilm} from "./view/film.js";
import {createSitePopup} from "./view/popup.js";
import SchowMoreButtonView from "./view/show-more-button.js";
import {generateFilm} from "./mock/film.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const FILM_COUNT = 15;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);


renderElement(siteHeaderElement, new UserMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SiteFilter(films).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const filmsContainerComponent = new FilmsContainerView();
renderElement(siteMainElement, filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

const siteFilmsListContainer = siteMainElement.querySelector(`.films-list__container`);
for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(siteFilmsListContainer, createSiteFilm(films[i]), `beforeend`);
}

renderTemplate(siteFooterElement, createSitePopup(films[0]), `afterEnd`);

if (films.length > FILM_COUNT_PER_STEP) {
  const schowMoreButtonComponent = new SchowMoreButtonView();
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  renderElement(filmsContainerComponent.getElement(), schowMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  schowMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(siteFilmsListContainer, createSiteFilm(film), `beforeend`));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      schowMoreButtonComponent.getElement().remove();
      schowMoreButtonComponent.removeElement();
    }
  });
}
