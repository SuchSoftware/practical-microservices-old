const createRead = require('./read')
const configureCreateSubscription = require('./subscribe')
const createWrite = require('./write')
const VersionConflictError = require('./version-conflict-error')

function createMessageStore ({ db }) {
  const write = createWrite({ db })
  const read = createRead({ db })
  const createSubscription = configureCreateSubscription({
    read: read.read,
    readLastMessage: read.readLastMessage,
    write: write
  })
  return {
    write: write,
    createSubscription,
    read: read.read,
    readLastMessage: read.readLastMessage,
    fetch: read.fetch,
    stop: db.stop
  }
}

module.exports = exports = createMessageStore
exports.project = createRead.project
exports.VersionConflictError = VersionConflictError
