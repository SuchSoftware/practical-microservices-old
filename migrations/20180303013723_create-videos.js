exports.up = knex =>
  knex.schema.createTable('videos', table => {
    table.string('id').primary()
    table.string('name')
    table.string('uri')
    table.integer('sequence')
  })

exports.down = knex => knex.schema.dropTable('videos')
