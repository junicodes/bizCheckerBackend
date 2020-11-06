'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('business_owner').notNullable()
      table.string('business_name').nullable()
      table.string('business_email').nullable()
      table.string('business_address').nullable()
      table.string('business_dob').nullable()
      table.string('cac_number').notNullable().unique()
      table.string('tin_number').notNullable().unique()
      table.string('inapp_cac_url_token').notNullable().unique()
      table.string('inapp_tin_url_token').notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
