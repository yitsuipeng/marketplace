import { Publisher, Subjects, ItemUpdatedEvent } from "@ytmarketplace/common";

export class ItemUpdatedPublisher extends Publisher<ItemUpdatedEvent> {
    readonly subject = Subjects.ItemUpdated;
}