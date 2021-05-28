const faker = require('faker');

function createCoords(coordId) {
  const { latitude, longitude } = faker.address;

  return {
    lat: latitude(),
    long: longitude(),
    id: getRandomId(),
    coordId,
  };
}

function getRandomId() {
  return Math.random().toString(36).slice(2);
}

function getHashCode(str, maxIdx) {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return ((hash % maxIdx) + maxIdx) % maxIdx;
}

function printSwapValues(v1, v2) {
  console.log(v1);
  console.log(`                      ⬇  ⬇  ⬇`);
  console.log(v2);
  console.log();
}

function printPadded(val, padNum = 5) {
  return val.toString().padStart(padNum, ' ');
}

module.exports = {
  createCoords,
  getRandomId,
  getHashCode,
  printSwapValues,
  printPadded,
};
