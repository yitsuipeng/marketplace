import { Subjects, Publisher, ExpirationCompleteEvent } from "@ytmarketplace/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}