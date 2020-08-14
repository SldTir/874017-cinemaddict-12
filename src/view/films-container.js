import AbstractView from "./abstract.js";

const createSiteFilmsContainer = () => {
  return (
    `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>  
      <div class="films-list__container">
      </div>        
    </section>
  </section>`
  );
};

export default class SiteFilmsContainer extends AbstractView {
  getTemplate() {
    return createSiteFilmsContainer();
  }
}
