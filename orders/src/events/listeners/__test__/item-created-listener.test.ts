import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { ItemCreatedEvent } from "@ytmarketplace/common";
import { ItemCreatedListener } from "../item-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Item } from "../../../models/item";

const setup = async () => {
    const listener = new ItemCreatedListener(natsWrapper.client);

    const data: ItemCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
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

    return { listener, data, msg };
}
it('creates and save an item', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const item = await Item.findById(data.id);

    expect(item).toBeDefined();
    expect(item!.title).toEqual(data.title);
    expect(item!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});