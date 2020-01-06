const test = require('blue-tape')

const ifOrigin = require('./if-origin')

test('It calls the function if orign matches', t => {
  const message = {
    metadata: {
      originStreamName: 'matcharoo-3bd94252-103b-4710-8281-623b7c86cc48'
    }
  }

  const handler = ifOrigin('matcharoo', () => {
    t.pass('Function was called')

    return Promise.resolve(true)
  })

  return handler(message)
})

test('It does not call the function if origin does not match', t => {
  const message = {
    metadata: {
      originStreamName: 'nope-3bd94252-103b-4710-8281-623b7c86cc48'
    }
  }

  const handler = ifOrigin('matcharoo', () => {
    return Promise.reject(new Error('Function was called'))
  })

  return handler(message)
    .then(() => t.pass('Handler not called'))
})
