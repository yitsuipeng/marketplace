import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Item } from '../../models/item';

it('returns an error if the item does not exist', async () => {
    const itemId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ itemId })
        .expect(404);
});

it('returns an error if the item is already reserved', async () => {
  const item = Item.build({
    title: 'product',
    price: 20
  });
  await item.save();
  const order = Order.build({
    item,
    userId: 'asdfjkl',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(400);
});

it('reserves a item', async () => {
  const item = Item.build({
    title: 'chou',
    price: 20,
  });
  await item.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(201);
});

it.todo('emits an order created event');