const uuid = require('uuid/v4')

const MovedControls = require('../../src/move-file-component/controls/events/moved')
const { project } = require('../../src/message-store/read')

const events = [MovedControls.example()]

const projection = {
  $init: { fileId: null, source: null, destination: null, isMoved: false }
  // Need to add handlers for any event types that affect this projection.
  // In our present case, that's just the "Moved" event
}

const file = project(events, projection)

console.log({ file })
console.log('Has the file been moved?', file.isMoved ? 'Yes' : 'No')
