import { Kafka, EachMessagePayload } from 'kafkajs';
import { Server, Socket } from 'socket.io';
import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';

import schema from '../schema';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
dotenv.config();

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket: Socket) => {
  console.log('new client connected');
});

server.listen(process.env.SOCKET_SERVER_PORT, () => {
  console.log(`listening on :${process.env.SOCKET_SERVER_PORT}`);
});

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER_INTERNAL as string]
});

async function start() {
  try {
    const consumer = kafka.consumer({ groupId: 'test-consumer-group' });

    await consumer.connect();
    await consumer.subscribe({
      topic: process.env.KAFKA_TOPIC as string,
      fromBeginning: true
    });

    await consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        if (message.value) {
          io.emit('data-event', schema.fromBuffer(message.value));
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}

start();
