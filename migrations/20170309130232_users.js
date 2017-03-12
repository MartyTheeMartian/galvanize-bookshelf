
exports.up = function(knex, Promise) {

  return knex.schema.createTable('users', (table) => {
     table.increments();
     table.string('first_name').defaultTo('').notNullable();
     table.string('last_name').defaultTo('').notNullable();
     table.string('email').notNullable().unique();
     table.specificType('hashed_password', 'char(60)').notNullable();
     table.timestamp("created_at").defaultTo(knex.raw('now()')).notNullable();
     table.timestamp("updated_at").defaultTo(knex.raw('now()')).notNullable();
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
