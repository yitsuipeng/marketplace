import { Publisher, Subjects, ItemCreatedEvent } from "@ytmarketplace/common";

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
    readonly subject = Subjects.ItemCreated;
}