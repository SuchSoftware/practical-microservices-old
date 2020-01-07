const test = require('blue-tape')
const { existsSync } = require('fs')

const CommandControls = require('../../../../src/move-file-component/controls/commands/move')
const { config } = require('../../../test-helper')

test('It moves a file', t => {
  const move = CommandControls.example()
  const entityStreamName = `moveFile-${move.data.fileId}`

  // Observe that a message was written
  //
  // Need an exercise for this too
  // Invoke the message handler
  return config.moveFileComponent.handlers
    .Move(move)
    .then(() => {
      t.ok(existsSync(move.data.destination), 'File is in place')
    })
    .then(() =>
      config.messageStore.read(entityStreamName).then(messages => {
        t.equals(messages.length, 1, 'Only 1 message')
        t.equals(messages[0].type, 'Moved', 'It is a Moved event')
      })
    )
})
