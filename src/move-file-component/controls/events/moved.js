const { join } = require('path')

const IdControls = require('../id')
const TimeControls = require('../time')

module.exports = {
  example () {
    const fileId = IdControls.example()

    return {
      id: IdControls.example(),
      type: 'Moved',
      metadata: {},
      data: {
        fileId,
        source: this.source(),
        destination: this.destination(fileId)
      },
      processedTime: TimeControls.Processed.example()
    }
  },

  source () {
    return `file-${IdControls.example()}`
  },

  destination (fileId) {
    return join(__dirname, '..', '..', '..', '..', 'tmp', fileId)
  }
}
