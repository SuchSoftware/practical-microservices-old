const uuid = require('uuid/v4')

const { config } = require('../preamble')

const fileId = uuid()
const move = {
  id: uuid(),
  type: 'Move',
  metadata: {
    traceId: uuid(),
    originStreamName: `catalog-${uuid}`
  },
  data: {
    fileId,
    source: uuid(),
    destination: `tmp/${fileId}`
  }
}

config.moveFileComponent.handlers
  .Move(move)
  .then(() => config.moveFileComponent.handlers.Move(move))
  .finally(config.messageStore.stop)

console.log('File moved.  Inspect message store.')
