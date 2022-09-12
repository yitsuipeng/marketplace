import { Listener, OrderCreatedEvent, Subjects } from "@ytmarketplace/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Item } from "../../models/item";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const item = await Item.findById(data.item.id);

        if (!item) {
            throw new Error('Item not found');
        }

        item.set({ orderId: data.id });

        await item.save();

        msg.ack();
    }
}