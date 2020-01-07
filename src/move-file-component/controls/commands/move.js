const { join } = require('path')

const IdControls = require('../id')

module.exports = {
  example () {
    const fileId = IdControls.example()

    return {
      id: IdControls.example(),
      type: 'Move',
      metadata: {},
      data: {
        fileId,
        source: this.source(),
        destination: this.destination(fileId)
      }
    }
  },

  source () {
    return `file-${IdControls.example()}`
  },

  destination (fileId) {
    return join(__dirname, '..', '..', '..', '..', 'tmp', fileId)
  }
}
