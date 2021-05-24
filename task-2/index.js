const { Kafka } = require('kafkajs');

const { getHashCode } = require('../shared/utils');
const { handleErrors } = require('./error-handling');

let processedCount = 0;
const KEY_LENGTH = 10;
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
      const obj = JSON.parse(message.value.toString());
      const hash = getHashCode(obj.id, KEY_LENGTH);
      if (hash === 0) {
        console.log('Saving message...', { ...obj });
        savedMessages.push(obj);
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
  console.log('Total processed messages: ', processedCount);
  console.log('Saved messages', savedMessages);
});

handleErrors();
