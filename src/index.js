// Assembles all the pieces to run the full system

const createExpressApplication = require('./express')
const createConfig = require('./config')
const env = require('./env')

// This is where the config is actually instantiated
const config = createConfig({ env })
const app = createExpressApplication({ config, env })

function start () {
  // Loops through each autonomous component, invoking its start function
  config.components.forEach(c => c.start())

  // Starts the Express app
  app.listen(env.port, signalAppStart)
}

function signalAppStart () {
  console.log(`${env.appName} started`)
  console.table([
    ['Port', env.port],
    ['Environment', env.env]
  ])
}

module.exports = {
  app,
  config,
  start
}
