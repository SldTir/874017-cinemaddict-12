import UserMenuView from "./view/user-menu.js";
import {createSiteNavigation} from "./view/navigation.js";
import {createSiteSort} from "./view/sort.js";
import {createSiteFilmsContainer} from "./view/films-container.js";
import {createSiteFilm} from "./view/film.js";
import {createSitePopup} from "./view/popup.js";
import {createSiteShowMoreButton} from "./view/show-more-button.js";
import {generateFilm} from "./mock/film.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const FILM_COUNT = 15;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

renderElement(siteHeaderElement, new UserMenuView().getElement, RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteNavigation(films), `beforeend`);
renderTemplate(siteMainElement, createSiteSort(), `beforeend`);

renderTemplate(siteMainElement, createSiteFilmsContainer(), `beforeend`);
const siteFilmsContainer = siteMainElement.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(siteFilmsContainer, createSiteFilm(films[i]), `beforeend`);
}

const siteFooterElement = document.querySelector(`.footer`);
renderTemplate(siteFooterElement, createSitePopup(films[0]), `afterEnd`);

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const siteFilmElement = siteMainElement.querySelector(`.films`);
  renderTemplate(siteFilmElement, createSiteShowMoreButton(), `beforeend`);

  const showMoreButton = siteMainElement.querySelector(`.films-list__show-more`);
  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(siteFilmsContainer, createSiteFilm(film), `beforeend`));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}
