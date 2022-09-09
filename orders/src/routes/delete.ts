import express,  { Request, Response } from  'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@ytmarketplace/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
    '/api/orders/:orderId', 
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        order.status = OrderStatus.Cancelled;
        await order.save();

        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            item: {
                id: order.item.id
            }
        });

        res.status(204).send(order);
});

export { router as deleteOrderRouter };