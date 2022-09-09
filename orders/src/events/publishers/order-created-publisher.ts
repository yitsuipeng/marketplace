import { Publisher, OrderCreatedEvent, Subjects } from "@ytmarketplace/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}