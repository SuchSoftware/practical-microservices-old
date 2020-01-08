// config.js is the heart of the dependency injection we use.  It is in this
// file that we piece together the actual runtime values.  This file breathes
// the breath of life into the otherwise hollow shell of the rest of the
// system.

const createHomeApplication = require('./home-application')
const createKnexClient = require('./knex-client')
const createMessageStore = require('./message-store')
const createMoveFileComponent = require('./move-file-component')
const createPostgresClient = require('./postgres-client')
const createTranscodeComponent = require('./transcode-component')
const createVideoCatalogComponent = require('./video-catalog-component')
const createVideoListAggregator = require('./video-list-aggregator')
const createViewCountAggregator = require('./view-count-aggregator')

// Even the configuration has a dependency, namely the run-time environment.
function createConfig ({ env }) {
  // We build a Postgres client connection
  const postgresClient = createPostgresClient({
    connectionString: env.messageStoreConnectionString
  })
  // The message store code receives that client connection.  This way, if we
  // want to do something else with that same connection, we can.  It's Just
  // Postgres™.
  const messageStore = createMessageStore({ db: postgresClient })

  const knexClient = createKnexClient({
    connectionString: env.databaseUrl
  })

  // Applications
  const homeApplication = createHomeApplication({
    db: knexClient,
    messageStore
  })

  // Components
  const moveFileComponent = createMoveFileComponent({ messageStore })
  const transcodeComponent = createTranscodeComponent({ messageStore })
  const videoCatalogComponent = createVideoCatalogComponent({ messageStore })

  // Aggregators
  const videoListAggregator = createVideoListAggregator({
    db: knexClient,
    messageStore
  })
  const viewCountAggregator = createViewCountAggregator()

  const components = [
    moveFileComponent,
    transcodeComponent,
    videoCatalogComponent,
    videoListAggregator,
    viewCountAggregator
  ]

  return {
    components,
    db: knexClient,
    env,
    homeApplication,
    messageStore,
    moveFileComponent,
    transcodeComponent,
    videoCatalogComponent,
    videoListAggregator,
    viewCountAggregator
  }
}

module.exports = createConfig
