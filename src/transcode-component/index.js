const uuid = require('uuid/v4')

const projection = require('./projection')

// Returns a url to the transcoded file
function transcodeFile (source) {
  // More simulation shenanigans
  console.log('If real transcoding were going on, you bet it would be here')

  return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
}

// Fleshing out these handlers is the main activity of the workshop.
function createHandlers ({ messageStore }) {
  return {
    async Transcode (transcode) {
      // 1. Where do you get the id?
      const transcodeId = ''
      // 2. What is the stream name where
      const streamName = ''
      // 3. Which message store function do you use to, um, fetch an entity
      // from the message store?
      // 4. Don't forget to fill out the projection in ./projection.js
      const transcoding = await messageStore.WHAT_FUNCTION(
        streamName,
        projection
      )

      // 5. Make it idempotent
      if (false) {
        console.log(`(${transcode.id}): Already transcoded. Skipping.`)

        return Promise.resolve(true)
      }

      // 6. Do the actual work.  This one is done for you.
      const transcodedUri = transcodeFile(transcode.data.source)

      const transcoded = {
        id: uuid(),
        type: 'Transcoded',
        metadata: {
          traceId: transcode.metadata.traceId
        },
        data: {
          transcodeId: transcode.data.transcodeId,
          source: transcode.data.source,
          transcodedUri,
          processedTime: new Date().toISOString()
        }
      }

      // Instead of just return an empty Promise, write `transcoded` to the
      // message store, rturning the resulting Promise.
      return Promise.resolve(true)
    }
  }
}

function createComponent ({ messageStore }) {
  const handlers = createHandlers({ messageStore })

  function start () {
    console.log('Starting transcode component')
  }

  return {
    handlers,
    start
  }
}

module.exports = createComponent
