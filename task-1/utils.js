function createCoords(coordId) {
  const sign = Math.round(Math.random()) ? 1 : -1;
  const latitude = Math.round(90 * Math.random()) * sign;
  const longitude = Math.round(180 * Math.random()) * sign;

  return { latitude, longitude, id: getRandomId(), coordId };
}

function getRandomId() {
  return Math.random().toString(36).slice(2);
}

module.exports = { createCoords, getRandomId };
