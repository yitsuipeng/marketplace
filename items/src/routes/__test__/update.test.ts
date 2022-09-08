import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put('/api/items')
		.set('Cookie', global.signin())
		.send({
			title: 'asdfjkl;',
			price: 20
		})
		.expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/items/${id}`)
		.send({
			title: 'asdfjkl;',
			price: 20
		})
		.expect(401);
});

it('returns a 401 if the user does not own the item', async () => {
	const response = await request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({
			title: 'asdfjkl;',
			price: 20
		});

	await request(app)
		.put(`/api/items/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'asdfjkl;asdfjkl;',
			price: 1000
		})
		.expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
	const cookie = global.signin();

	const response = await request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({
			title: 'asdfjkl;',
			price: 20
		});

	await request(app)
		.put(`/api/items/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: '',
			price: 20
		})
		.expect(400);

	await request(app)
		.put(`/api/items/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'asdfjkl;',
			price: -10
		})
		.expect(400);
});

it('updates the item provided valid inputs', async () => {
	const cookie = global.signin();

	const response = await request(app)
		.post('/api/items')
		.set('Cookie', cookie)
		.send({
			title: 'asdfjkl;',
			price: 20
		})
		.expect(201);

	await request(app)
		.put(`/api/items/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100
		})
		.expect(200);
	
	const itemResponse = await request(app)
		.get(`/api/items/${response.body.id}`)
		.send();

	expect(itemResponse.body.title).toEqual('new title');
	expect(itemResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
	const cookie = global.signin();

	const response = await request(app)
		.post('/api/items')
		.set('Cookie', cookie)
		.send({
			title: 'asdfjkl;',
			price: 20
		})
		.expect(201);

	await request(app)
		.put(`/api/items/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100
		})
		.expect(200);
	
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});