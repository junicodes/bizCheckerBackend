'use strict'

class AdminRegister {
  get rules () {
    return {
      // validation rules
      email: `required|string|unique:users,email`,
      password: `required|min:6`,
      bizness_owner: 'required|string',
      bizness_name: 'required|string|unique:bizness_acquireds,bizness_name',
      cac_number: 'required|string|unique:bizness_acquireds,cac_number',
      tin_number: 'required|string|unique:bizness_acquireds,tin_number',
      tin_transaction_ref: 'required|string|unique:bizness_acquireds:tin_transaction_ref',
    }
  }

  get messages() {
    return {
      'email.required': 'An email field is required to continue!',
      'email.unique': 'This email is already registered for an existing business owner, contact us if you think this is an error!.',
      'business_owner.required': 'The business owner field required!',
      'business_owner.required': 'The business owner field required!',
      'business_name.unique': 'This business name is already registered for an existing business owner!',
      'password.required': 'The password field required!',
      'password.min': 'The password field requires at least 6 chracters!',
      'cac_number.required': 'CAC number is required!',
      'tin_number.required': 'TIN number is required!',
      'tin_transaction_ref': 'Tin reference number is required'
    }
  }
  
  async fails(errorMessages) {
    return this.ctx.response.status(422).json({
       message: errorMessages[0].message
    });
  }
}

module.exports = AdminRegister
