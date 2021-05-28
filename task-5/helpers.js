// size of the bit vector
const L = 64;

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

function hash_func(x) {
  return (3 * x + 5) % 2 ** L;
}

function find_rightmost_bit(n) {
  if (n === 0) {
    return n;
  }
  const power = dec2bin(n).split('').reverse().indexOf('1');
  return 2 ** power;
}

function find_rightmost_unset_bit(n) {
  if (n === 0) {
    return n;
  }
  const idx = dec2bin(n).split('').reverse().indexOf('0');
  const power = idx === -1 ? dec2bin(n).split('').length : idx;
  return power;
}

module.exports = {
  hash_func,
  find_rightmost_bit,
  find_rightmost_unset_bit,
};
