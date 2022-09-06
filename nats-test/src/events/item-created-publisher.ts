import { Publisher } from './base-publisher';
import { ItemCreatedEvent } from './item-created-event';
import { Subjects } from './subjects';

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
  subject: Subjects.ItemCreated = Subjects.ItemCreated;
  queueGroupName = 'payments-service';

}