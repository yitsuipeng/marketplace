import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { ItemUpdatedEvent } from "@ytmarketplace/common";
import { ItemUpdatedListener } from "../item-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Item } from "../../../models/item";

const setup = async () => {
    const listener = new ItemUpdatedListener(natsWrapper.client);

    const item = Item.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'product',
        price: 10,
    });

    await item.save();

    const data: ItemUpdatedEvent['data'] = {
        id: item.id,
        version: item.version + 1,
        title: 'product2',
        price: 999,
        userId: 'asdfjkl'
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
    }

    return { msg, data, item, listener };
}
it('finds, updates, and saves an item', async () => {
    const { msg, data, item, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedItem = await Item.findById(item.id);

    expect(updatedItem!.title).toEqual(data.title);
    expect(updatedItem!.price).toEqual(data.price);
    expect(updatedItem!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has skipped version number', async () => {
    const { item, listener, data, msg } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});