import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { ItemCreatedEvent } from './item-created-event';
import { Subjects } from './subjects';

export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
  subject: Subjects.ItemCreated = Subjects.ItemCreated;
  queueGroupName = 'payments-service';

  onMessage(data: ItemCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}