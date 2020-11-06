'use strict'

const User = use('App/Models/User');
const UserController = use('App/Controllers/Http/User/UserController')
const dayjs = use('dayjs')
const Hash = use('Hash')
const Env = use('Env')

class AuthController {
    
    constructor(){
        this.cacCodeBreakOut = 0; this.tinCodeBreakOut = 0;
    }

    async makeUserApp({request, response}) {
        const password  =  await this.passwordGenerator(8)//Genrated a ramdom password for user 
        const result = await this.register(request.post(), password)
        return response.status(result.status_code).json(result)
    }

    async register({request, response}) {


        const userController = new UserController
        const verify_code =  await this.createVerifyCode();
        const User_code  =  await this.createUserCode()

        if(this.cacCodeBreakOut === 3 || this.tinCodeBreakOut === 3){
            this.cacCodeBreakOut = 0
            this.tinCodeBreakOut  = 0
            return {success: false, message: 'An error occured, this might be a network issue or error generating a secure details for User, please try again', status_code: 501}
        }

        Object.assign(UserData, {password: await Hash.make(password), verify_code, User_code})

        let res = await UserController.store(UserData, password, verify_code) //Transfer to User Controller
        switch(res.status) {
            case 201:
                return {success: res.success, message: res.message, data: res.User, status_code: 201}
            case 501: 
                return {success: res.error, message: res.message, hint: res.hint, status_code: 501}
        }
    }

    async login({request, auth, response}) {
        let {email, password} = request.post();

        try {
            if(await auth.authenticator('UserJwt').attempt(email, password)) {
                const User = await User.findBy('email', email)
                const token = await auth.generate(User)
                const photo = {
                    photoUrl: Env.get('CLOUDINARY_IMAGE_URL'),
                    image: User.photo
                }
                Object.assign(User, {photo, token})

                const currentDate = dayjs().format(); 
                const accountVerifyDate = dayjs(User.account_verified_at).format();
    
                if(accountVerifyDate < currentDate){
                    const mailResponse = await this.sendCode(User)
                    return response.status(mailResponse.status_code).json(mailResponse)
                }

                return response.status(200).json({success:true, User})
            }
        } catch (error) {
            return response.status(501).json({error: false, message: 'Invalid Details, please check if email or password are correct, if issues persit please contact support.', hint: error.message})
        }
    }

    async cacPermitCode () {
        const cacPermitCode = `cac-${stringGenerator(20)}`
        const checkIfExist = await User.findBy('cac_toke', cacPermitCode)
        if(checkIfExist) {
            if(this.cacCodeBreakOut < 3) {
                this.cacCodeBreakOut++;
                await this.createUserCode();
            }
        }
        return cacPermitCode;
    }

    async  tinPermitCode () {
        const tinPermitCode = `tin-${stringGenerator(20)}`
        const checkIfExist = await User.findBy('verify_code', tinPermitCode)
        if(checkIfExist) {
            if(this.tinCodeBreakOut < 3) {
                this.tinCodeBreakOut++;
                await this.createVerifyCode(); 
            }
        }
        return tinPermitCode;
    }
    
    async stringGenerator(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

}

module.exports = AuthController
