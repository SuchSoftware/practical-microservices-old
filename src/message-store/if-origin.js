const Bluebird = require('bluebird')

function streamCategory (streamName) {
  return streamName.split('-')[0]
}

/**
 * @description Wraps a handler, checking to see if the incoming message's
 * `metadata.originStreamN{ame` property matches the supplied category.
 * @param {string} category The category to match against
 * @param {function} handler The handler function to wrap
 * @returns {function} A handler function that will only execute if the category
 * is a match
 */
function ifOrigin (category, handler) {
  return message => {
    const messageStreamCategory =
      streamCategory(message.metadata.originStreamName)

    return messageStreamCategory !== category ?
      Bluebird.resolve(true) :
      handler(message)
  }
}

module.exports = ifOrigin
