import {getRandomInteger} from "./common.js";
import {Month} from "../const.js";
const RANGE_MIN = 0;

export const generateRating = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const reandomRating = lower + Math.random() * (upper - lower + 1);
  return parseFloat(reandomRating.toFixed(1));
};

export const createRandomDescription = (quantity, array) => {
  const randomDescription = [];
  const cloneDescription = array.slice();
  for (let i = 0; i <= quantity; i++) {
    const abc = getRandomInteger(RANGE_MIN, cloneDescription.length - 1);
    randomDescription.push(cloneDescription[abc]);
    cloneDescription.splice(abc, 1);
  }
  return randomDescription;
};

export const generateDate = () => {
  const maxDayGap = 7;
  const daysGap = getRandomInteger(-maxDayGap, 0);
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  currentDate.setDate(currentDate.getDate() + daysGap);
  return new Date(currentDate);
};

export const convertsDate = (date) => {
  const dateMs = new Date(convertDateMilliseconds(date));
  const day = String(dateMs.getDate()).padStart(2, `0`);
  const year = dateMs.getFullYear();
  const month = String(dateMs.getMonth() + 1).padStart(2, `0`);
  const minutes = String(dateMs.getMinutes()).padStart(2, `0`);
  const second = String(dateMs.getSeconds()).padStart(2, `0`);
  const convertedDate = `${year}/${month}/${day} ${minutes}:${second}`;
  return convertedDate;
};

export const convertDateMilliseconds = (date) => {
  return new Date(date).getTime();
};

export const convertMillisecondsDatePopup = (dateMill) => {
  const nedDate = new Date(dateMill);
  const day = String(nedDate.getDate()).padStart(2, `0`);
  const year = nedDate.getFullYear();
  const monthNumber = nedDate.getMonth();
  const month = Month[monthNumber];
  const convertedDate = `${day} ${month} ${year}`;
  return convertedDate;
};

const getWeightForNullValue = (valueA, valueB) => {
  if (valueA === null && valueB === null) {
    return 0;
  }

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }
  return null;
};

export const sortFilmDate = (filmA, filmB) => {
  const dateAMs = convertDateMilliseconds(filmA.releaseDate);
  const dateBMs = convertDateMilliseconds(filmB.releaseDate);
  const weight = getWeightForNullValue(dateAMs, dateBMs);

  if (weight !== null) {
    return weight;
  }

  return dateAMs - dateBMs;
};

export const sortFilmRating = (filmA, filmB) => {
  const weight = getWeightForNullValue(filmA.rating, filmB.rating);

  if (weight !== null) {
    return weight;
  }

  return filmB.rating - filmA.rating;
};
