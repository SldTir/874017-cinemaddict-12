import {createsUserMenu} from "./view/user-menu.js";
import {createSiteNavigation} from "./view/site-navigation.js";
import {createSiteSort} from "./view/site-sort.js";
import {createSiteFilmsContainer} from "./view/site-films-container.js";
import {createSiteFilm} from "./view/site-film.js";
import {createSitePopup} from "./view/site-popup.js";
import {createSiteShowMoreButton} from "./view/site-show-more-button.js";
import {generateFilm} from "./mock/film.js";

const FILM_COUNT = 5;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
console.log(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createsUserMenu(), `beforeend`);
render(siteMainElement, createSiteNavigation(), `beforeend`);
render(siteMainElement, createSiteSort(), `beforeend`);

render(siteMainElement, createSiteFilmsContainer(), `beforeend`);
const siteFilmsContainer = siteMainElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_COUNT; i++) {
  render(siteFilmsContainer, createSiteFilm(films[i]), `beforeend`);
}

const siteFilmElement = siteMainElement.querySelector(`.films`);
render(siteFilmElement, createSiteShowMoreButton(), `beforeend`);

const siteFooterElement = document.querySelector(`.footer`);
// render(siteFooterElement, createSitePopup(), `afterEnd`);
