'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BiznessAcquired extends Model {

    user () {
        return this.belongsTo('App/Models/User', 'owner_id', 'id') //Model, Opposite HasMany Relationship
    }
}

module.exports = BiznessAcquired
