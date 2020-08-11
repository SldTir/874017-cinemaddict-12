import {createElement} from "../utils.js";

const createSiteShowMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class SiteShowMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSiteShowMoreButton();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}