const uuid = require('uuid/v4')

const { config } = require('../preamble')
const TranscodedControls = require('../../src/video-catalog-component/controls/events/transcoded')

const transcoded = TranscodedControls.example()
transcoded.metadata.traceId = uuid()
transcoded.streamName = `videoCatalog-${uuid()}`

config.videoCatalogComponent.eventHandlers
  .Transcoded(transcoded)
  .then(() => config.videoCatalogComponent.eventHandlers.Transcoded(transcoded))
  .then(() => console.log('Transcoded processed.'))
  .finally(config.messageStore.stop)
