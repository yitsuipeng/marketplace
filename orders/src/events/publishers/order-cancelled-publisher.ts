import { Publisher, OrderCancelledEvent, Subjects } from "@ytmarketplace/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}