const { Kafka } = require('kafkajs');

const { handleErrors } = require('./error-handling');

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
      if (processedCount < S) {
        savedMessages.push(message.value.toString());
      } else {
        const shouldKeep = Math.random() < S / processedCount;
        if (!shouldKeep) {
          return;
        }

        console.log('> ', message.value.toString());
        const idx = Math.floor(Math.random() * savedMessages.length);
        savedMessages[idx] = message.value.toString();
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
  console.log('Kept messages', savedMessages);
});

handleErrors();
