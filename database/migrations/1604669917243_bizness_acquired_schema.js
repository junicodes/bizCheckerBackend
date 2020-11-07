'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BiznessAcquiredSchema extends Schema {
  up () {
    this.create('bizness_acquireds', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('bizness_name').notNullable().unique()
      table.string('bizness_icon').nullable()
      table.string('bizness_photo').nullable()
      table.string('address').nullable()
      table.string('date_issued').nullable()
      table.string('cac_number').notNullable().unique()
      table.string('tin_number').notNullable().unique()
      table.string('tin_transaction_ref').notNullable().unique()
      table.string('inapp_cac_url_token').notNullable().unique()
      table.string('inapp_tin_url_token').notNullable().unique()
      table.timestamps()

      table.foreign('user_id').references('users.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('bizness_acquireds')
  }
}

module.exports = BiznessAcquiredSchema
