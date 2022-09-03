import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { 
	requireAuth, 
	validateRequest,
	NotFoundError,
	NotAuthorizedError
} from '@ytmarketplace/common';
import { Item } from '../models/item';

const router = express.Router();

router.put(
	'/api/items/:id', 
	requireAuth, 
	[
    	body('title').not().isEmpty().withMessage('Title is required'),
    	body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
	], 
	validateRequest, 
	async (req: Request, res: Response) => {
    	const item = await Item.findById(req.params.id);
	
		if (!item) {
			throw new NotFoundError();
		}

		if (item.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		item.set({
			title: req.body.title,
			price: req.body.price
		});
		await item.save();
		
		res.send(item);	
	}
);

export { router as updateItemRouter };