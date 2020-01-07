const fs = require('fs')
const uuid = require('uuid/v4')

// Okay, this doesn't actually move a file, but the point of the workshop
// is to show the flow of data through an autonomous services architecture and
// not to actually take on YouTube.
function moveFile (source, destination) {
  // In a real file move operation, we'd care about the source.  We don't
  // here. #DemoLife
  fs.closeSync(fs.openSync(destination, 'w'))
}

// Handlers will do the actual work of handling messages.
// They are analogous to HTTP handlers, only the stimulus they respond to is
// one of the messages communicated over pub/sub.
//
// Fleshing out these handlers is the main activity of the workshop.
function createHandlers ({ messageStore }) {
  return {
    Move (move) {
      // Write some code here to move the file

      return Promise.resolve(true)
    }
  }
}

function createComponent ({ messageStore }) {
  const handlers = createHandlers({ messageStore })

  // Components get new messages to process by polling the message store.
  // We decouple actually starting the component from the rest of its
  // definition.  Naturally, starting the polling cycle in test would proveo
  // problematic.
  //
  // The convention in this code base is that each component exposes a `start`
  // function that gets picked up in `src/index.js`.
  function start () {
    console.log('Starting move-file component')
  }

  return {
    handlers,
    start
  }
}

module.exports = createComponent
