const uuid = require('uuid/v4')

const { config } = require('../preamble')
const MovedControls = require('../../src/move-file-component/controls/events/moved')

const moved = MovedControls.example()
moved.metadata.traceId = uuid()
moved.metadata.originStreamName = `someoneElse-${uuid()}`

config.videoCatalogComponent.moveFileEventHandlers
  .Moved(moved)
  .then(() => config.videoCatalogComponent.moveFileEventHandlers.Moved(moved))
  .then(() => console.log('All done.  We should not see any writes.'))
  .finally(config.messageStore.stop)
