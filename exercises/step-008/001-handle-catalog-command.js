const uuid = require('uuid/v4')

const { config } = require('../preamble')
const VideoCatalogControls = require('../../src/video-catalog-component/controls/commands/catalog')

const catalog = VideoCatalogControls.example()

config.videoCatalogComponent.commandHandlers
  .Catalog(catalog)
  .then(() => config.videoCatalogComponent.commandHandlers.Catalog(catalog))
  .then(() => console.log('Catalog process started.'))
  .finally(config.messageStore.stop)
