const createPostgresClient = require('./postgres-client')
const createMessageStore = require('./message-store')

function createConfig ({ env }) {
  const postgresClient = createPostgresClient({
    connectionString: env.messageStoreConnectionString
  })
  const messageStore = createMessageStore({ db: postgresClient })

  return {
    env,
    messageStore
  }
}

module.exports = createConfig
