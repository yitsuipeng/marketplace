import express,  { Request, Response } from 'express';
import { 
    requireAuth, 
    validateRequest, 
    NotFoundError, 
    OrderStatus, 
    BadRequestError 
} from '@ytmarketplace/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Item } from '../models/item';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 60;

router.post(
    '/api/orders', 
    requireAuth, 
    [
        body('itemId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('ItemId must be provided')
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const { itemId } = req.body;

        const item = await Item.findById(itemId);
        if (!item) {
            throw new NotFoundError();
        }

        const isReserved = await item.isReserved();
        if (isReserved) {
            throw new BadRequestError('Item is already reserved');
        }

        const expiration  = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            item
        });
        await order.save();

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            item: {
                id: item.id,
                price: item.price
            }
        });

        res.status(201).send(order);
    }
);

export { router as newOrderRouter };