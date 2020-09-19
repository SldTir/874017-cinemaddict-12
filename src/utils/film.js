import {getRandomInteger} from "./common.js";
import moment from "moment";

const RANGE_MIN = 0;

export const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

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

export const convertDateMilliseconds = (date) => {
  return new Date(date).getTime();
};

export const formatDurationMovie = (date) => {
  const dateMinuteHour = moment.utc().startOf(`day`).add(date, `minutes`).format(`h mm`);
  const arr = dateMinuteHour.split(` `);
  return `${arr[0]}h ${arr[1]}m`;
};

export const formatDurationMovieStats = (date) => {
  const hour = Math.trunc(date / 60);
  const minutes = date - hour * 60;
  return `${hour} ${minutes}`;
};


export const formatDateComment = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

export const formatReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
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
