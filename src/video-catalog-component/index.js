const uuid = require('uuid/v4')

const projection = require('./projection')

// This component has 4 sets of handlers:
// 1. Its command stream
// 2. Its event stream
// 3. move-file's event stream
// 4. transcode's event stream
function createCommandHandlers ({ messageStore }) {
  return {
    async Catalog (catalog) {
      const videoId = catalog.data.videoId
      const videoStreamName = `videoCatalog-${videoId}`
      const video = await messageStore.fetch(videoStreamName, projection)

      if (video.isReceived) {
        console.log(`(${catalog.id}) Video already received. Skipping`)

        return true
      }

      const received = {
        id: uuid(),
        type: 'Received',
        metadata: {
          traceId: catalog.metadata.traceId
        },
        data: {
          videoId: catalog.data.videoId,
          source: catalog.data.source
        }
      }

      return messageStore.write(videoStreamName, received)
    }
  }
}

function createEventHandlers ({ messageStore }) {
  return {
    async Received (received) {
      // This is where we'll kick off the file move

      // 1. Load the entity

      // 2. Make the handler idempotent.  Which value from the projection would
      // tell us we don't need to move the file?

      // 3. Write q Move command for move-file.
      //   - Use our entity id as the id for the move command stream name
      //   - Set the originStreamName in metadata

      return true
    }
  }
}

function createComponent ({ messageStore }) {
  const commandHandlers = createCommandHandlers({ messageStore })
  const eventHandlers = createEventHandlers({ messageStore })

  function start () {
    console.log('Starting video catalog component')
  }

  return {
    commandHandlers,
    eventHandlers,
    start
  }
}

module.exports = createComponent
