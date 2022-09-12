import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';

it('fetches the order', async () => {
    const item = Item.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'product',
        price: 20
    });
    await item.save();

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ itemId: item.id })
        .expect(201);

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
    const item = Item.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'product',
        price: 20
    });
    await item.save();

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ itemId: item.id })
        .expect(201);

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});