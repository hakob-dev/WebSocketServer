import { Kafka } from 'kafkajs';
import schema from '../schema';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER_INTERNAL as string]
});

const producer = kafka.producer();

async function startPublisher() {
  try {
    await producer.connect();
    console.log('Producer Connected Successfully');
  } catch (err) {
    console.log(err);
  }

  setInterval(async () => {
    try {
      const recordMeta = await producer.send({
        topic: process.env.KAFKA_TOPIC as string,
        messages: [
          {
            value: schema.toBuffer({
              randomId: Math.floor(Math.random() * 100),
              title: 'Dummy title'
            })
          }
        ]
      });
      console.log(
        'published: ',
        recordMeta
          .map((r) => `${r.baseOffset}th record in ${r.topicName}`)
          .join('')
      );
    } catch (err) {
      console.log('Error while publishing', err);
    }
  }, 3_000);
}

startPublisher();
