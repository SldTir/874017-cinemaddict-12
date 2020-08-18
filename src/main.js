import UserMenuView from "./view/user-menu.js";
import SiteFilter from "./view/filter.js";
import MoveListPresenter from "./presenter/move-list.js";
import {generateFilm} from "./mock/film.js";
import {render, RenderPosition} from "./utils/render.js";

const FILM_COUNT = 18;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const moveListPresenter = new MoveListPresenter(siteMainElement);

render(siteHeaderElement, new UserMenuView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteFilter(films), RenderPosition.BEFOREEND);
moveListPresenter.init(films);
