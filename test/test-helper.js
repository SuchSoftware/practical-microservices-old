const Bluebird = require('bluebird')
const test = require('blue-tape')
const { readdirSync, unlinkSync } = require('fs')
const { join } = require('path')

const { app, config } = require('../src')

test.onFinish(() => {
  config.messageStore.stop()
})

/* eslint-disable no-console */
process.on('unhandledRejection', err => {
  console.error('Uh-oh. Unhandled Rejection')
  console.error(err)

  process.exit(1)
})
/* eslint-enable no-console */

module.exports = {
  app,
  config
}
