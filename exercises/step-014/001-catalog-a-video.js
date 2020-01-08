const uuid = require('uuid/v4')

const { config } = require('../preamble')

const videoId = uuid()
const catalog = {
  id: uuid(),
  type: 'Catalog',
  metadata: {
    traceId: uuid()
  },
  data: {
    videoId,
    source: 'sweet-vid'
  }
}
const streamName = `videoCatalog:command-${videoId}`

config.messageStore
  .write(streamName, catalog)
  .then(() => console.log('Command sent!'))
  .finally(config.messageStore.stop)
