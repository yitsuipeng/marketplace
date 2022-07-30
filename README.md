# multi-service_app

## documentation
### Resource Types
|Resource Name|Name|Type|
|-------------|----|----|
|User|email<br>password|string<br>string|
|Item|title<br>price<br>userId<br>orderId|string<br>number<br>Ref to User<br>Ref to Order|
|Order|userId<br>status<br>itemId<br>expiresAt|Ref to User<br>Created/Cancelled/AwaitingPayment/Completed<br>Ref to Item<br>Date|
|Charge|orderId<br>status<br>amount<br>stripeId<br>stripeRefundId|Ref to Order<br>Created/Failed/Completed<br>number<br>string<br>string|

### Services

|Services name|Description|
|-------------|-----------|
|auth|Everything related to user signup/signin/signout|
|items|Item creation/editing. Knows whether a item can be updated|
|orders|Order creation/editing|
|expiration|Watches for orders to be created, cancels them after 15 minutes|
|payments|Handles credit card payments. Cancels orders if payments fails, completes if payment succeeds|
