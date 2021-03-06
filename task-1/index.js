const { Kafka } = require('kafkajs');
const { interval } = require('rxjs');
const { map } = require('rxjs/operators');

const { handleErrors } = require('./error-handling');
const { createCoords } = require('../shared/utils');

let sub$;
let msgId = 0;
const kafka = new Kafka({
  clientId: 'coords-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const run = async () => {
  console.log('Producer is running...');

  await producer.connect();
  sub$ = interval(200)
    .pipe(map(() => JSON.stringify(createCoords(msgId++))))
    .subscribe((coords) => {
      console.log('> ', { coords });
      producer.send({
        topic: 'random-coords',
        messages: [{ value: coords }],
      });
    });
};

run().catch(console.error);

handleErrors([sub$]);
