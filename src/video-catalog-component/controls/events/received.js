const { join } = require('path')

const IdControls = require('../id')

module.exports = {
  example () {
    return {
      id: IdControls.example(),
      type: 'Received',
      metadata: {},
      data: {
        videoId: IdControls.example(),
        source: this.source()
      }
    }
  },

  source () {
    return 'https://www.youtube.com/watch?v=GI_P3UtZXAA'
  }
}
