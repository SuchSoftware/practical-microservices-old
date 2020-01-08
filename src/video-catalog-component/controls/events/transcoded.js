const { join } = require('path')

const IdControls = require('../id')

module.exports = {
  example () {
    return {
      id: IdControls.example(),
      type: 'Transcoded',
      metadata: {},
      data: {
        transcodedUri: this.destination()
      }
    }
  },

  destination () {
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
}
