import AbstractView from "./abstract.js";

const createSiteShowMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class SiteShowMoreButton extends AbstractView {
  getTemplate() {
    return createSiteShowMoreButton();
  }
}
