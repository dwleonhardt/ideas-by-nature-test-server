


exports.up = function(knex, Promise) {
  return knex.schema.alterTable('price', function(table){
    table.bigInteger('volume').notNullable();
    table.decimal('cap24hrChange').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('price', function(table){
    table.dropColumn('volume')
    table.dropColumn('cap24hrChange');
  });
};
