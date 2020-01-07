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
  .then(() =>
    console.log('File moved.  Inspect message store.  Is there only 1 event?')
  )
  .finally(config.messageStore.stop)
