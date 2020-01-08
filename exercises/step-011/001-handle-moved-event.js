const uuid = require('uuid/v4')

const { config } = require('../preamble')
const MovedControls = require('../../src/video-catalog-component/controls/events/moved')
const ReceivedControls = require('../../src/video-catalog-component/controls/events/received')

const received = ReceivedControls.example()
const videoStreamName = `videoCatalog-${received.data.videoId}`

const moved = MovedControls.example()
moved.metadata.traceId = uuid()
moved.streamName = videoStreamName

// The projection process expects there to be a Received event before the Moved
// event would be handled.
config.messageStore
  .write(videoStreamName, received)
  .then(() => config.videoCatalogComponent.eventHandlers.Moved(moved))
  .then(() => config.videoCatalogComponent.eventHandlers.Moved(moved))
  .then(() => console.log('Moved processed.'))
  .finally(config.messageStore.stop)
