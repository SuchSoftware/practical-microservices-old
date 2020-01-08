const uuid = require('uuid/v4')

const { config } = require('../preamble')
const TranscodedControls = require('../../src/transcode-component/controls/events/transcoded')

const transcoded = TranscodedControls.example()
transcoded.metadata.traceId = uuid()
transcoded.metadata.originStreamName = `videoCatalog-${uuid()}`

config.videoCatalogComponent.transcodeEventHandlers
  .Transcoded(transcoded)
  .then(() =>
    config.videoCatalogComponent.transcodeEventHandlers.Transcoded(transcoded)
  )
  .then(() => console.log('Transcoded processed.'))
  .finally(config.messageStore.stop)
