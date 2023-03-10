import { Kafka, RecordMetadata } from 'kafkajs';
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

  setInterval(publish, 3_000);
}

async function publish() {
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
    logRecord(recordMeta);
  } catch (err) {
    console.log('Error while publishing', err);
  }
}

function logRecord(recordMeta: RecordMetadata[]) {
  console.log(
    'published: ',
    recordMeta.map((r) => `${r.baseOffset}th record in ${r.topicName}`).join('')
  );
}

startPublisher();
