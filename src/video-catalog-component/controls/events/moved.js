const { join } = require('path')

const IdControls = require('../id')
const TimeControls = require('../time')

module.exports = {
  example () {

    return {
      id: IdControls.example(),
      type: 'Moved',
      metadata: {},
      data: {
        destination: this.destination()
      },
      processedTime: TimeControls.Processed.example()
    }
  },

  destination () {
    return 'exampleDestinationFile'
  }
}
