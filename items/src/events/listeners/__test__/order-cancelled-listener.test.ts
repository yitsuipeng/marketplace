import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@ytmarketplace/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Item } from "../../../models/item";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const item = Item.build({
        title: 'product',
        price: 99,
        userId: 'asdfjkl'
    });
    item.set({ orderId });
    await item.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        item: {
            id: item.id
        }
    };

    const msg: Message = {
        ack: jest.fn(),
        getSubject: function (): string {
            throw new Error("Function not implemented.");
        },
        getSequence: function (): number {
            throw new Error("Function not implemented.");
        },
        getRawData: function (): Buffer {
            throw new Error("Function not implemented.");
        },
        getData: function (): String | Buffer {
            throw new Error("Function not implemented.");
        },
        getTimestampRaw: function (): number {
            throw new Error("Function not implemented.");
        },
        getTimestamp: function (): Date {
            throw new Error("Function not implemented.");
        },
        isRedelivered: function (): boolean {
            throw new Error("Function not implemented.");
        },
        getCrc32: function (): number {
            throw new Error("Function not implemented.");
        }
    };

    return { listener, item, data, msg, orderId };
};

it('updates the item, publishes an event, and acks the message', async () => {
    const { listener, item, data, msg, orderId } = await setup();

    await listener.onMessage(data, msg);

    const updatedItem = await Item.findById(item.id);
    expect(updatedItem!.orderId).not.toEqual(data.id);
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});