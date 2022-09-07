import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@ytmarketplace/common';
import { Item } from '../models/item';
import { ItemCreatedPublisher } from '../events/publishers/item-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/items', 
	requireAuth, 
	[
    	body('title').not().isEmpty().withMessage('Title is required'),
    	body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
	], 
	validateRequest, 
	async (req: Request, res: Response) => {
		const { title, price } = req.body;

		const item = Item.build({
				title,
				price,
				userId: req.currentUser!.id
			});
		await item.save();
		await new ItemCreatedPublisher(natsWrapper.client).publish({
			id: item.id,
			title: item.title,
			price: item.price,
			userId: item.userId
		});

		res.status(201).send(item);
	}
);

export { router as createItemRouter };