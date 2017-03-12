
exports.up = function(knex, Promise) {

  return knex.schema.createTable('books', (table) => {
     table.increments('id').primary();
     table.string('title').defaultTo('').notNullable();
     table.string('author').defaultTo('').notNullable();
     table.string('genre').defaultTo('').notNullable();
     table.text('description').defaultTo('').notNullable();
     table.text('cover_url').defaultTo('').notNullable();
     table.timestamp("created_at").defaultTo(knex.raw('now()')).notNullable();
     table.timestamp("updated_at").defaultTo(knex.raw('now()')).notNullable();
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
