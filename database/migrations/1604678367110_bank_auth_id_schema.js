'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BankAuthIdSchema extends Schema {
  up () {
    this.create('bank_auth_ids', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('bank_name').notNullable()
      table.string('auth_id').notNullable()
      table.timestamps()

      table.foreign('user_id').references('users.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('bank_auth_ids')
  }
}

module.exports = BankAuthIdSchema
