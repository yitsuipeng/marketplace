import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@ytmarketplace/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Item } from "../../../models/item";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const item = Item.build({
        title: 'product',
        price: 99,
        userId: 'asdfjkl'
    });

    await item.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'asdfjkl',
        expiresAt: 'asdfjkl',
        item: {
            id: item.id,
            price: item.price
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

    return { listener, item, data, msg };
}

it('sets the userId of the item', async () => {
    const { listener, item, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedItem = await Item.findById(item.id);

    expect(updatedItem!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, item, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});