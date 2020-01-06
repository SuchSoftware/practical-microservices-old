const colors = require('colors/safe')
const dotenv = require('dotenv')

const packageJson = require('../package.json')

const envResult = dotenv.config()

if (envResult.error) {
  // eslint-disable-next-line no-console
  console.error(
    `${colors.red('[ERROR] env failed to load:')} ${envResult.error}`
  )

  process.exit(1)
}

function requireFromEnv (key) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.error(`${colors.red('[APP ERROR] Missing env variable:')} ${key}`)

    return process.exit(1)
  }

  return process.env[key]
}

// START: sendEmailService
// START: bare.bones.server
module.exports = {
  // END: bare.bones.server
  // START: bare.bones.server
  appName: requireFromEnv('APP_NAME'),
  // END: bare.bones.server
  cookieSecret: requireFromEnv('COOKIE_SECRET'),
  databaseUrl: requireFromEnv('DATABASE_URL'),
  // START: bare.bones.server
  env: requireFromEnv('NODE_ENV'),
  port: parseInt(requireFromEnv('PORT'), 10),
  // END: bare.bones.server
  // START_HIGHLIGHT
  emailDirectory: requireFromEnv('EMAIL_DIRECTORY'),
  systemSenderEmailAddress: requireFromEnv('SYSTEM_SENDER_EMAIL_ADDRESS'),
  // END_HIGHLIGHT
  // START: bare.bones.server
  version: packageJson.version,
  messageStoreConnectionString:
    requireFromEnv('MESSAGE_STORE_CONNECTION_STRING')
}
// END: bare.bones.server
// END: sendEmailService
