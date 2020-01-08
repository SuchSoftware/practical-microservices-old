const uuid = require('uuid/v4')

const { config } = require('../preamble')
const ReceivedControls = require('../../src/video-catalog-component/controls/events/received')

const received = ReceivedControls.example()
received.metadata.traceId = uuid()

config.videoCatalogComponent.eventHandlers
  .Received(received)
  .then(() => config.videoCatalogComponent.eventHandlers.Received(received))
  .then(() => console.log('Received processed.'))
  .finally(config.messageStore.stop)
