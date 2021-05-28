const { interval, Subscription } = require('rxjs');
const { map } = require('rxjs/operators');
const { handleErrors } = require('./error-handling');
const {
  hash_func,
  find_rightmost_bit,
  find_rightmost_unset_bit,
} = require('./helpers');
const { printPadded } = require('../shared/utils');

let vector = 0;
let currentApprox = 0;
let uniqueValues = new Set();

const stream = interval(25).pipe(map(() => Math.round(Math.random() * 10000)));
const subscription$ = new Subscription();

subscription$.add(
  stream.subscribe((number) => {
    uniqueValues.add(number);

    // compute the hash value bounded by (2 ** L)
    // this hash value will ensure uniform distribution
    // of elements of the stream in range [0, 2 ** L)
    const hash = hash_func(number);

    // find rightmost bit and set it in the bit vector
    const rightmost_bit = find_rightmost_bit(hash);
    vector = vector | rightmost_bit;

    // find the rightmost unset bit in the bit vector that
    // suggests that the probability being 0
    // and return the approximate cardinality
    currentApprox = 2 ** find_rightmost_unset_bit(vector);

    console.log(
      `| Value: ${printPadded(number)} | FM: ${printPadded(
        currentApprox
      )} | True: ${printPadded(uniqueValues.size)} |`
    );
  })
);

process.on('SIGINT', function () {
  console.dir(
    `Unique elements: Approximate N: ${currentApprox}, True N: ${uniqueValues.size}`
  );
  subscription$.unsubscribe();
});

handleErrors();
