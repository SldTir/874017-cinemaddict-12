import AbstractView from "./abstract.js";

const createSiteFilmsContainer = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class BoardView extends AbstractView {
  getTemplate() {
    return createSiteFilmsContainer();
  }
}
