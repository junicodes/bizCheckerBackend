'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BusinessSchema extends Schema {
  up () {
    this.create('businesses', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('businesses')
  }
}

module.exports = BusinessSchema
