import nats from 'node-nats-streaming';
import { ItemCreatedPublisher } from './events/item-created-publisher';

console.clear();

const stan = nats.connect('marketplace', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new ItemCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'product',
      price: 20
    });
  } catch (err) {
    console.error(err);
  }
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // stan.publish('item:created', data, () => {
  //   console.log('Event published');
  // });
});