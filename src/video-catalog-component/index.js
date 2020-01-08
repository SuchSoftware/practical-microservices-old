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
      const videoId = received.data.videoId
      const streamName = `videoCatalog-${videoId}`
      const video = await messageStore.fetch(streamName, projection)

      if (video.isMoved) {
        console.log(`(${received.id}) Video already moved. Skipping`)

        return true
      }

      const move = {
        id: uuid(),
        type: 'Move',
        metadata: {
          traceId: received.metadata.traceId,
          originStreamName: streamName
        },
        data: {
          fileId: videoId,
          source: received.data.source,
          destination: `tmp/${received.data.source}`
        }
      }
      const commandStream = `moveFile:command-${videoId}`

      return messageStore.write(commandStream, move)
    },

    async Moved (moved) {
      // 1. Load & project the video entity
      //   - You can get the streamName from moved.streamName
      const streamName = moved.streamName
      const video = await messageStore.fetch(streamName, projection)

      // 2. Our goal in this handler is to kick off the transcoding job.
      //   - Which property of the video entity do we use for idempotence
      //     in this step?
      if (video.isTranscoded) {
        console.log(`(${moved.id}) Video already transcoded. Skipping`)

        return true
      }

      // 3. If we haven't already handled it, write a Transcode command
      // for the transcode-component
      const transcode = {
        id: uuid(),
        type: 'Transcode',
        metadata: {
          traceId: moved.metadata.traceId,
          originStreamName: streamName
        },
        data: {
          transcodeId: video.videoId,
          source: moved.data.destination
        }
      }
      const commandStreamName = `transcode:command-${video.videoId}`

      return messageStore.write(commandStreamName, transcode)
    },

    async Transcoded (transcoded) {
      // 1. Load & project the video entity
      //   - You can get the streamName from moved.streamName
      const streamName = transcoded.streamName
      const video = await messageStore.fetch(streamName, projection)

      // 2. Our goal in this handler is to say that it has been cataloged
      //   - Which property of the video entity do we use for idempotence
      //     in this step?
      if (video.isCataloged) {
        console.log(`(${transcoded.id}) Video already cataloged. Skipping`)

        return true
      }

      // 3. If we haven't already handled it, write a Cataloged event to
      // ourselves
      const cataloged = {
        id: uuid(),
        type: 'Cataloged',
        metadata: {
          traceId: transcoded.metadata.traceId
        },
        data: {}
      }

      return messageStore.write(streamName, cataloged)
    }
  }
}

function createMoveFileEventHandlers ({ messageStore }) {
  return {
    async Moved (moved) {
      // 1. Make sure it's one of ours
      const [originCategory, _] = moved.metadata.originStreamName.split('-')

      if (originCategory !== 'videoCatalog') {
        return true
      }

      // 2. Fetch the entity and make the handler idempotent
      //   - Where can we find the streamName for the video entity?
      const streamName = moved.metadata.originStreamName
      const video = await messageStore.fetch(streamName, projection)

      if (video.isMoved) {
        console.log(`(${moved.id}) Video already moved. Skipping`)

        return true
      }

      // 3. Write a Moved event to our stream
      const videoMoved = {
        id: uuid(),
        type: 'Moved',
        metadata: {
          traceId: moved.metadata.traceId
        },
        data: {
          destination: moved.data.destination
        }
      }

      return messageStore.write(streamName, videoMoved)
    }
  }
}

function createTranscodeEventHandlers ({ messageStore }) {
  return {
    async Transcoded (transcoded) {
      // 1. Make sure it's one of ours
      const [originCategory, _] = transcoded.metadata.originStreamName.split(
        '-'
      )

      if (originCategory !== 'videoCatalog') {
        return true
      }

      // 2. Fetch the entity and make the handler idempotent
      //   - Where can we find the streamName for the video entity?
      const streamName = transcoded.metadata.originStreamName
      const video = await messageStore.fetch(streamName, projection)

      if (video.isTranscoded) {
        console.log(`(${transcoded.id}) Video already transcoded. Skipping`)

        return true
      }

      // 3. Write a Transcoded event to our stream
      const videoTranscoded = {
        id: uuid(),
        type: 'Transcoded',
        metadata: {
          traceId: transcoded.metadata.traceId
        },
        data: {
          transcodedUri: transcoded.data.transcodedUri
        }
      }

      return messageStore.write(streamName, videoTranscoded)
    }
  }
}

function createComponent ({ messageStore }) {
  const commandHandlers = createCommandHandlers({ messageStore })
  const eventHandlers = createEventHandlers({ messageStore })
  const moveFileEventHandlers = createMoveFileEventHandlers({ messageStore })
  const transcodeEventHandlers = createTranscodeEventHandlers({ messageStore })

  const commandSubscription = messageStore.createSubscription({
    streamName: 'videoCatalog:command',
    handlers: commandHandlers,
    subscriberId: 'videoCatalogCommandConsumer'
  })
  const eventSubscription = messageStore.createSubscription({
    streamName: 'videoCatalog',
    handlers: eventHandlers,
    subscriberId: 'videoCatalogEventConsumer'
  })
  const moveFileEventSubscription = messageStore.createSubscription({
    streamName: 'moveFile',
    handlers: moveFileEventHandlers,
    subscriberId: 'videoCatalogMoveFileEventConsumer'
  })
  const transcodeEventSubscription = messageStore.createSubscription({
    streamName: 'transcode',
    handlers: transcodeEventHandlers,
    subscriberId: 'videoCatalogTranscodeEventConsumer'
  })

  function start () {
    console.log('Starting video catalog component')

    commandSubscription.start()
    eventSubscription.start()
    moveFileEventSubscription.start()
    transcodeEventSubscription.start()
  }

  return {
    commandHandlers,
    eventHandlers,
    moveFileEventHandlers,
    transcodeEventHandlers,
    start
  }
}

module.exports = createComponent
