const { Kafka } = require('kafkajs');

const { handleErrors } = require('./error-handling');
const { printSwapValues } = require('../shared/utils');

let processedCount = 0;
const S = 10;
const savedMessages = [];
const kafka = new Kafka({
  clientId: 'coords-app',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'random-coords' });

const run = async () => {
  console.log('Consumer is running...');

  await consumer.connect();
  await consumer.subscribe({ topic: 'random-coords', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      processedCount++;
      console.log('> ', message.value.toString());
      if (processedCount <= S) {
        savedMessages.push(message.value.toString());
      } else {
        const shouldReplace = Math.random() < S / processedCount;
        if (!shouldReplace) {
          return;
        }

        const i = Math.floor(Math.random() * savedMessages.length);
        const toBeReplaced = JSON.parse(savedMessages[i].toString());
        const toReplaceWith = JSON.parse(message.value.toString());

        printSwapValues(toBeReplaced, toReplaceWith);
        savedMessages[i] = message.value.toString();
      }
    },
  });
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

process.on('SIGINT', function () {
  consumer.stop();
  console.log('\nTotal processed messages: ', processedCount);
  console.log('Kept messages:', savedMessages.length);
  console.table(savedMessages.map((m) => JSON.parse(m)));
});

handleErrors();
