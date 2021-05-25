const { interval, Subscription } = require('rxjs');
const { map } = require('rxjs/operators');

const { handleErrors } = require('./error-handling');

let savedStreams = {};
const subscription$ = new Subscription();

const arr = new Array(100).fill(0);
const streams = arr.map((_, idx) =>
  interval(50).pipe(map(() => Number(Math.random() > 0.95)))
);
const C = 0.05;

for (let i = 0; i < streams.length; i++) {
  streams[i].subscribe((value) => {
    if (i in savedStreams) {
      savedStreams[i] = savedStreams[i] * (1 - C) + value;
      if (savedStreams[i] < 0.5) {
        delete savedStreams[i];
      }
    } else {
      if (value) {
        savedStreams[i] = 1;
      }
    }
  });
}

subscription$.add(
  interval(1000).subscribe(() => {
    let maxval = 0;
    let maxidx = null;
    const keys = Object.keys(savedStreams);
    for (const key of keys) {
      if (savedStreams[key] > maxval) {
        maxval = savedStreams[key];
        maxidx = key;
      }
    }
    console.log(`highest stream number is ${maxidx} with value ${maxval}`);
  })
);

process.on('SIGINT', function () {
  console.dir(savedStreams);
  subscription$.unsubscribe();
});

handleErrors();
