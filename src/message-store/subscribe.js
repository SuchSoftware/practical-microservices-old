const Bluebird = require('bluebird')
const uuid = require('uuid/v4')

function configureCreateSubscription ({ read, readLastMessage, write }) {
  return ({
    streamName,
    handlers,
    messagesPerTick = 100,
    subscriberId,
    positionUpdateInterval = 100,
    tickIntervalMs = 100
  }) => {
    const subscriberStreamName = `subscriberPosition-${subscriberId}`

    let currentPosition = 0
    let messagesSinceLastPositionWrite = 0
    let keepGoing = true

    /**
     * @description - Writes the subscription's read position
     */
    function writePosition (position) {
      const positionEvent = {
        id: uuid(),
        type: 'Read',
        data: { position }
      }

      return write(subscriberStreamName, positionEvent)
    }

    function updateReadPosition (position) {
      currentPosition = position
      messagesSinceLastPositionWrite += 1

      if (messagesSinceLastPositionWrite === positionUpdateInterval) {
        messagesSinceLastPositionWrite = 0
        
        return writePosition(position)
      }

      return Bluebird.resolve(true)
    }

    function loadPosition () {
      return readLastMessage(subscriberStreamName)
        .then(message => {
          currentPosition = message ? message.data.position : 0
        })
    }

    function getNextBatchOfMessages () {
      return read(streamName, currentPosition + 1, messagesPerTick)
    }

    function handleMessage (message) {
      const handler = handlers[message.type] || handlers.$any

      return handler ? handler(message) : Promise.resolve(true)
    }

    function processBatch (messages) {
      return Bluebird.each(messages, message =>
        handleMessage(message)
          .then(() => updateReadPosition(message.globalPosition))
          .catch(err => {
            logError(message, err)

            // Re-throw so that we can break the chain
            throw err
          })
      )
        .then(() => messages.length)
    }

    function logError (lastMessage, error) {
      // eslint-disable-next-line no-console
      console.error(
        'error processing:\n',
        `\t${subscriberId}\n`,
        `\t${lastMessage.id}\n`,
        `\t${error}\n`
      )
    }

    /**
     * @description - Generally not called from the outside.  This function is
     *   called on each of the timeouts to see if there are new events that need
     *   processing.
     */
    function tick () {
      return getNextBatchOfMessages()
        .then(processBatch)
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error('Error processing batch', err)

          stop()
        })
    }

    async function poll () {
      await loadPosition()

      // eslint-disable-next-line no-unmodified-loop-condition
      while (keepGoing) {
        const messagesProcessed = await tick()

        if (messagesProcessed === 0) {
          await Bluebird.delay(tickIntervalMs)
        }
      }
    }

    function start () {
      // eslint-disable-next-line
      console.log(`Started ${subscriberId}`)

      return poll()
    }

    function stop () {
      // eslint-disable-next-line
      console.log(`Stopped ${subscriberId}`)

      keepGoing = false
    }

    return {
      loadPosition,
      start,
      stop,
      tick,
      writePosition
    }
  }
}

module.exports = configureCreateSubscription
