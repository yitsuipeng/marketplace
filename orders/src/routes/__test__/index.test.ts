import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Item } from '../../models/item';

const buildItem = async () => {
    const item = Item.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'product',
        price: 20
    });
    await item.save();

    return item;
}

it('fetches orders for an particular user', async () => {
    const itemOne = await buildItem();
    const itemTwo = await buildItem();
    const itemThree = await buildItem();

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ itemId: itemOne.id })
        .expect(201);
    
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ itemId: itemTwo.id })
        .expect(201);
    
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ itemId: itemThree.id })
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].item.id).toEqual(itemTwo.id);
    expect(response.body[1].item.id).toEqual(itemThree.id);
});