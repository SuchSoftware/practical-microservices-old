// This script will verify that you have node and docker installed and running
// properly.

const pg = require('pg')
const uuid = require('uuid/v4')

const connectionString = 'postgres://postgres@localhost:5433/message_store'
const writeFunctionSql = 'SELECT write_message($1, $2, $3, $4, $5, $6)'
const getLastMessageSql = 'SELECT * FROM get_last_message($1)'

const pool = new pg.Pool({ connectionString })

const messageId = uuid()
const streamName = `verification-${uuid()}`
const messageType = 'InstallationVerified'
const verifiedTime = new Date()
const messageData = {
  verified: verifiedTime.toISOString() 
}

pool.query(
  writeFunctionSql,
  [
    messageId,
    streamName,
    messageType,
    messageData,
    {},
    null
  ]
)
  .then(() => console.log(`Wrote message: ${messageId}`))
  .then(() => pool.query(getLastMessageSql, [ streamName ]))
  .then(readMessage => {
    const prettyMessage = JSON.stringify(readMessage.rows[0], null, 2)

    console.log(`Read back: ${prettyMessage}`)
  })
  .catch(e => {
    if (e.message.includes('ECONNREFUSED')) {
      console.error('Unable to connect to message store database.  Did you run `docker-compose rm -sf && docker-compose up`?')
    } else {
      console.error(`
        Verification failed for an unknown reason.

        1. Did you run \`npm install\`?
        2. Did you install Docker?
      `)
    }
  })
  .finally(() => pool.end())
