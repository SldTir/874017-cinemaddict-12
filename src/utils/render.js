import Abstract from "../view/abstract.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const addElement = (container, component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  const element = component.getElement();

  if (component === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  container.appendChild(element);
};

export const removeElement = (child) => {
  if (child instanceof Abstract) {
    child = child.getElement();
  }

  const parent = child.parentElement;

  if (parent === null || child === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.removeChild(child);
};
