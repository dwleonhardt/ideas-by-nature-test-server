
exports.up = function(knex, Promise) {
  return knex.schema.createTable('price', function(table){
    table.increments();
    table.integer('currency_id').references('id').inTable('currency').notNullable();
    table.decimal('price').notNullable();
    table.timestamp('time').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('price');
};
