const Bluebird = require('bluebird')
const pg = require('pg')

function createDatabase ({ connectionString }) {
  const pool = new pg.Pool({ connectionString, Promise: Bluebird }) // <callout id="co.messageStore.db.pool" />

  function query (sql, values = []) {
    return pool.query(sql, values)
  }

  return {
    query,
    stop: () => pool.end()
  }
}

module.exports = createDatabase
