'use strict'

const User = use('App/Models/User')
const Database = use('Database')

class UserController {

  async store (data) {

    console.log(data)
    const trx = await Database.beginTransaction()

    try {
      const userInfo = await User.create(data, trx);

      await trx.commit()

      return { status: true, message: `Hurray! registration successful, Thank you.`, data: userInfo, status_code: 201 }

    } catch (error) {
        await trx.rollback()
        return { status: false, message: 'An unexpected error occured when creating a rider.', hint: error.message, status_code: 501 }
    }
  }

  
}

module.exports = UserController




