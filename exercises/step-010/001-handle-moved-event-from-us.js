const uuid = require('uuid/v4')

const { config } = require('../preamble')
const MovedControls = require('../../src/move-file-component/controls/events/moved')

const moved = MovedControls.example()
moved.metadata.traceId = uuid()
moved.metadata.originStreamName = `videoCatalog-${uuid()}`

config.videoCatalogComponent.moveFileEventHandlers
  .Moved(moved)
  .then(() => config.videoCatalogComponent.moveFileEventHandlers.Moved(moved))
  .then(() => console.log('Moved recorded.'))
  .finally(config.messageStore.stop)
