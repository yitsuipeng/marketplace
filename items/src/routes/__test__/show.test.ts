import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
import mongoose from  'mongoose';

it('returns a 404 if the item is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/items/${id}`)
        .send()
        .expect(404);

});

it('returns the item if the item is found', async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/items')
        .set('Cookie', global.signin())
        .send({
            title, price
        })
        .expect(201);

    const itemResponse = await request(app)
        .get(`/api/items/${response.body.id}`)
        .send()
        .expect(200);

    expect(itemResponse.body.title).toEqual(title);
    expect(itemResponse.body.price).toEqual(price);
});