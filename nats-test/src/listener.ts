import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { ItemCreatedListener } from './events/item-created-listener';

console.clear();

const stan = nats.connect('marketplace', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new ItemCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());