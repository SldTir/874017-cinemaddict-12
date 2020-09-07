import AbstractView from "./abstract.js";
import {FilterType} from "../const";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  debugger;
  const activeFilter = currentFilterType === type ? `main-navigation__item--active` : ``;
  let filterContent;
  if (FilterType.ALL_MOVIES === type) {
    filterContent = type;
  } else {
    filterContent = count > 5 ? type : `${type} <span class="main-navigation__item-count">${count}</span>`;
  }
  return (
    `<a href="${name}" class="main-navigation__item ${activeFilter}">${filterContent}</a>`
  );
};

const createSiteFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``);
  return (
    `<nav class="main-navigation">
     <div class="main-navigation__items">
       ${filterItemsTemplate}
     </div>
     <a href="#stats" class="main-navigation__additional">Stats</a>
   </nav>`
  );
};

export default class FilterView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefatult();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
