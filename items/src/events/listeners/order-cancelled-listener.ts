import { Listener, OrderCancelledEvent, Subjects } from "@ytmarketplace/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Item } from "../../models/item";
import { ItemUpdatedPublisher } from "../publishers/item-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const item = await Item.findById(data.item.id);

        if (!item) {
            throw new Error('Item not found');
        }

        item.set({ orderId: undefined });

        await item.save();
        new ItemUpdatedPublisher(this.client).publish({
            id: item.id,
            price: item.price,
            title: item.userId,
            userId: item.userId,
            orderId: item.orderId,
            version: item.version
        });

        msg.ack();
    }
}