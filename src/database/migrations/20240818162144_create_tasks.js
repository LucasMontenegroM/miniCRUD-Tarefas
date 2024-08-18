/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tarefas', (table) => {

        table.increments('id').primary();
        table.string('titulo').notNullable();
        table.text('descricao').notNullable();
        table.timestamp('criado_em').defaultTo(knex.fn.now()).notNullable();
        table.boolean('concluido').defaultTo(false).notNullable();
        table.integer('usuario').unsigned().notNullable().references('id').inTable('usuario').onDelete('CASCADE');
    
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.droptable('tarefas');
};
