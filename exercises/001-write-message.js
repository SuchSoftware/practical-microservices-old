// We'll make liberal use of UUIDs throughout the workshop
const uuid = require('uuid/v4')

// Make sure you're running the repo's docker setup!
// docker-compose rm -sf && docker-compose up

// THIS WILL GO BOOM! UNTIL WE MAKE A CHANGE.  CAN YOU SEE WHAT THE CHANGE IS?

// All exercise files will use this preamble so that we can set up the
// message store and other dependencies in 1 spot.
const { config } = require('./preamble')

const paymentId = uuid()
const paymentReceived = {
  // id: uuid(),
  type: 'PaymentReceived',
  data: {
    paymentId,
    amount: '12.34'
  }
}
// We'll talk more about streams later, but for now notices that we have
// "payment", a dash, and then the `paymentId` defined above.  This entire
// constructed stream is an "entity" stream, and all the events related to
// this payment will be in this stream.  Entity streams that start with
// "payment" like this are said to be in the "payment" category.  Naming that
// "payment" came from our own analysis of what our system was supposed to be.
const paymentStream = `payment-${paymentId}`

// PART 2
// Now that you're writing a single message, write another one!  You can pick
// a new message type, the same message type, a new category, the same
// category, or whatever you like.  One rule to start though, attempt it first
// using the same identifier stored in `paymentId` above.
//
// An event needs an `id`, a `type`, and `data`.
// const myNewEvent = {
//
// }
// const myNewStreamName = ``

return (
  config.messageStore
    // The write function is defined in src/message-store/write.js.  It takes
    // a `streamName` and the `message` to write.  It also takes an optional
    // `expectedVersion` parameter.  We'll get into the use of this parameter
    // later.
    .write(paymentStream, paymentReceived)
    // The second write goed here
    // ------------------------------------------------------------------------
    // Quirk of the `pg` library, if we don't explicitly stop the message
    // store's connection, the process will hang until the connection times out.
    .finally(config.messageStore.stop)
)
