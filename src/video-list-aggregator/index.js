const projection = require('./projection')

function createHandlers ({ messageStore, queries }) {
  return {
    async Cataloged (cataloged) {
      const video = await messageStore.fetch(cataloged.streamName, projection)
      const listItem = {
        id: video.videoId,
        uri: video.uri,
        // These are uninspiring video names.  "Hey did you see the
        // Honest Movie Trailer, 53c1798e-0619-4c6c-a680-b805d669fee1,
        // yesterday?  #DemoLife
        name: video.videoId,
        sequence: cataloged.globalPosition
      }

      return queries.upsertVideo(listItem)
    }
  }
}

function createQueries ({ db }) {
  return {
    upsertVideo (video, sequence) {
      const rawQuery = `
        INSERT INTO
          videos (id, name, uri, sequence)
        VALUES (:id, :name, :uri, :sequence)
        ON CONFLICT (id) DO NOTHING
      `

      return db.then(client => client.raw(rawQuery, video))
    }
  }
}

function createComponent ({ db, messageStore }) {
  const queries = createQueries({ db })
  const handlers = createHandlers({ messageStore, queries })

  const subscription = messageStore.createSubscription({
    streamName: 'videoCatalog',
    handlers,
    subscriberId: 'videoListAggregator'
  })

  function start () {
    console.log('Starting video list aggregator')

    subscription.start()
  }

  return {
    start
  }
}

module.exports = createComponent
