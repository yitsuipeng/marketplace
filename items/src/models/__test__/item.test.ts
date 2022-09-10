import { ItemCreatedPublisher } from '../../events/publishers/item-created-publisher';
import { Item } from '../item';

it('implements optimistic concurrency control', async () => {
    const item = Item.build({
        title: 'product',
        price: 5,
        userId: '123'
    });

    await item.save();

    const firstInstance = await Item.findById(item.id);
    const secondInstance = await Item.findById(item.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const item = Item.build({
        title: 'product',
        price: 5,
        userId: '123'
    });

    await item.save();
    expect(item.version).toEqual(0);
    await item.save();
    expect(item.version).toEqual(1);
    await item.save();
    expect(item.version).toEqual(2);
})