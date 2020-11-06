'use strict'

class AdminRegister {
  get rules () {
    return {
      // validation rules
      email: `required|string|unique:users,email`,
      password: `required|min:6`,
      business_owner: 'required|string',
      cac_number: 'required|string|unique:users,cac_number',
      tin_number: 'required|string|unique:users,tin_number'
    }
  }

  get messages() {
    return {
      'email.required': 'An email field is required to continue!',
      'email.unique': 'This email is already registered for an existing business owner, contact us if you think this is an error!.',
      'business_owner.required': 'The business owner field required!',
      'password.required': 'The password field required!',
      'password.min': 'The password field requires at least 6 chracters!',
      'cac_number.required': 'CAC number is required!',
      'tin_number.required': 'TIN number is required!'
    }
  }
  
  async fails(errorMessages) {
    return this.ctx.response.status(422).json({
       message: errorMessages[0].message
    });
  }
}

module.exports = AdminRegister
