const { join } = require('path')

const IdControls = require('../id')

module.exports = {
  example () {
    const transcodeId = IdControls.example()

    return {
      id: IdControls.example(),
      type: 'Transcoded',
      metadata: {},
      data: {
        transcodeId,
        transcodedUri: this.destination()
      }
    }
  },

  destination () {
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
}
