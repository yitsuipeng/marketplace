import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ItemCreatedEvent } from '@ytmarketplace/common';
import { Item } from '../../models/item';
import { queueGroupName } from './queue-group-name';

export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
  subject: Subjects.ItemCreated = Subjects.ItemCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ItemCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const item = Item.build({
      id,
      title,
      price,
    });
    await item.save();

    msg.ack();
  }
}
