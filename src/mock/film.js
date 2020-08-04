const RANGE_MIN = 0;
const RANGE_MAX = 4;

const movieNames = [
  `Easy Virtue`,
  `The Boat That Rocked`,
  `The Iron Lady`,
  `Brideshead Revisited`,
  `Pride`,
  `The Remains of the Day`,
  `Billy Elliot`
];

const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const description = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus`
];

const yearProductions = [`01 April 1995`, `04 January 1928`, `15 May 1932`, `20 February 1924`, `13 August 1936`];

const runtimes = [`1h 55m`, `2h 30m`, `3h 05m`, `1h 30m`, `2h 00m`];

const genres = [`Action`, `Drama`, `Horror`, `Fantasy`, `Thriller`];

const directors = [`Steven Spielberg`, `David Fincher`, `James Cameron`, `Martin Scorsese`, `Christopher Nolan`];

const country = [`USA`, `Denmark `, `Finland`, `Scotland `, `Belgium `];

const ageRatings = [`8+`, `12+`, `16+`, `18+`, `4+`];

const writers = [
  `Anne Wigton`,
  `Heinz Herald`,
  `Richard Weil`,
  `Lucas Anderson`,
  `Jackson Thomas`,
];

const actors = [
  `Aiden Wilson`,
  `Benjamin Moore`,
  `Daniel Taylor`,
  `Elijah Smith`,
  `James Johnson`,
];
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRating = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const reandomRating = lower + Math.random() * (upper - lower + 1);
  return parseFloat(reandomRating.toFixed(1));
};

const createRandomDescription = (quantity, array) => {
  const randomDescription = [];
  const cloneDescription = array.slice();
  for (let i = 0; i <= quantity; i++) {
    const abc = getRandomInteger(RANGE_MIN, cloneDescription.length - 1);
    randomDescription.push(cloneDescription[abc]);
    cloneDescription.splice(abc, 1);
  }
  return randomDescription;
};

const generateDate = () => {
  const maxDayGap = 7;
  const daysGap = getRandomInteger(-maxDayGap, 0);
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  currentDate.setDate(currentDate.getDate() + daysGap);
  return new Date(currentDate);
};

const createComment = () => {
  const emotions = [`angry`, `puke`, `sleeping`, `smile`];
  const date = generateDate();
  const authors = [`Liam Smith`, `Noah Johnson`, `William Williams`, `James Jones`, `Oliver Brown`];
  const messages = [
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Almost two hours? Seriously?`,
    `Bla bla bla!`
  ];

  return {
    emotion: emotions[getRandomInteger(RANGE_MIN, emotions.length - 1)],
    dueDate: date,
    author: authors[getRandomInteger(RANGE_MIN, authors.length - 1)],
    message: messages[getRandomInteger(RANGE_MIN, messages.length - 1)],
  };
};

const createComments = (count) => {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push(createComment());
  }
  return comments;
};

export const generateFilm = () => {
  const comments = createComments(getRandomInteger(RANGE_MIN, RANGE_MAX));
  return {
    director: directors[getRandomInteger(RANGE_MIN, directors.length - 1)],
    writers: createRandomDescription(getRandomInteger(RANGE_MIN, 4), writers),
    actors: createRandomDescription(getRandomInteger(RANGE_MIN, 4), actors),
    country: country[getRandomInteger(RANGE_MIN, country.length - 1)],
    name: movieNames[getRandomInteger(RANGE_MIN, movieNames.length - 1)],
    originalName: movieNames[getRandomInteger(RANGE_MIN, movieNames.length - 1)],
    poster: posters[getRandomInteger(RANGE_MIN, posters.length - 1)],
    rating: generateRating(RANGE_MIN, 9),
    releaseDate: yearProductions[getRandomInteger(RANGE_MIN, yearProductions.length - 1)],
    runtime: runtimes[getRandomInteger(RANGE_MIN, runtimes.length - 1)],
    genre: genres[getRandomInteger(RANGE_MIN, genres.length - 1)],
    numberСomments: comments.length,
    description: createRandomDescription(getRandomInteger(RANGE_MIN, RANGE_MAX), description),
    ageRatings: ageRatings[getRandomInteger(RANGE_MIN, ageRatings.length - 1)],
    comments,
  };
};
