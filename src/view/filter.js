import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  const activeFilter = currentFilterType === type ? `main-navigation__item--active` : ``;
  const filterContent = type === `All movies` ? type : `${type} <span class="main-navigation__item-count">${count}</span>`;

  return (
    `<a href="${name}" class="main-navigation__item ${activeFilter}" data-menu-item="${MenuItem.MOVIE_LIST}" data-filter-name="${type}">${filterContent}</a>`
  );
};

const createSiteFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``);
  return (
    `<nav class="main-navigation">
     <div class="main-navigation__items">
       ${filterItemsTemplate}
     </div>
     <a href="#stats" class="main-navigation__additional" data-menu-item="${MenuItem.STATISTICS}">Stats</a>
   </nav>`
  );
};

export default class FilterView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._navigatioonChangeHandler = this._navigatioonChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.currentTarget.getAttribute(`data-filter-name`));
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    const navigationItem = this.getElement().querySelectorAll(`.main-navigation__item`);
    navigationItem.forEach((item) => item.addEventListener(`click`, this._filterTypeChangeHandler));
  }

  _navigatioonChangeHandler(evt) {
    evt.preventDefault();
    const menuItem = evt.target.getAttribute(`data-menu-item`);
    this._callback.navigationTypeChange(menuItem);
  }

  setNavigationChangeHandler(callback) {
    this._callback.navigationTypeChange = callback;
    const navigationItem = this.getElement();
    navigationItem.addEventListener(`click`, this._navigatioonChangeHandler);
  }
}
