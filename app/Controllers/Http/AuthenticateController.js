'use strict'

const User = use('App/Models/User');
const BiznessAcquired = use('App/Models/BiznessAcquired')
const UserController = use('App/Controllers/Http/UserController')
const BiznessAcquiredController = use('App/Controllers/Http/BiznessAcquiredController')
const CacVerifyController = use('App/Controllers/Http/CacVerifyController')
const dayjs = use('dayjs')
const Hash = use('Hash')
const Env = use('Env')

class AuthController {
    
    constructor(){
        this.cacCodeBreakOut = 0; this.tinCodeBreakOut = 0;
    }


    async register({request, response}) {

        const userController = new UserController
        const cacVerifyController = new CacVerifyController
        const biznessAcquiredController = new BiznessAcquiredController

       try {

            const inapp_cac_url_token  =  await this.cacPermitCode();
            const inapp_tin_url_token =  await this.tinPermitCode()

            console.log(inapp_cac_url_token, inapp_tin_url_token)

            const {email, cac_number, bizness_name, bizness_owner, tin_number, tin_transaction_ref, password} = request.post();


            //Verify CAC token
            const cacChecking = await cacVerifyController.regVerify(cac_number, bizness_name)

            console.log(cacChecking)

            if(cacChecking.status) {
                return {
                    status: false, 
                    message: `Please your CAC Identification Number is not valid!`,
                    status_code: 400
                }
            } 
            

            if(this.cacCodeBreakOut === 3 || this.tinCodeBreakOut === 3){

                this.cacCodeBreakOut = 0
                this.tinCodeBreakOut = 0

                return {
                    status: false, 
                    message: 'An error occured, this might be a network issue or error generating a secure details for User, please try again', 
                    status_code: 501
                }
            }

            let user = await userController.store({email, password, bizness_owner}) //Transfer to User Controller

            //Validate this insert
            if(!user.status){
                return {
                    status: false, 
                    message: 'An error occured, this might be a network issue or and unexpected issue occured, please try again', 
                    status_code: 501
                }
            }

            const bizData = {
                user_id: user.data.id,
                bizness_name,
                address: cacChecking.businessAddress,
                date_issued: cacChecking.dateOfIncorporation,
                cac_number,
                tin_number,
                tin_transaction_ref,
                inapp_cac_url_token,
                inapp_tin_url_token
            }

            let bizNameStore = await biznessAcquiredController.regInsert(bizData)

            if(!bizNameStore.status){
                return {
                    status: false, 
                    message: 'An error occured, this might be a network issue or and unexpected issue occured, please try again', 
                    status_code: 501
                }
            }

            //Validate this insert
            return response.status(200).json({status: true, message: 'Registration Succesfull', user: user.data, bizName: bizNameStore.bizData})


       } catch (error) {
            return response.status(501).json({
                status: false, 
                message: 'An error occured while registring your business account, if issues persit please contact support.', 
                hint: error.message
            })
       }
    }

    async login({request, auth, response}) {
        console.log(auth)
        let {email, password} = request.all();

        console.log(email, password)

        try {
                await auth.attempt(email, password)

                const user = await User.findBy('email', email)
                
                console.log(user)

                const token = await auth.generate(user)

                const photo = {
                    photoUrl: Env.get('CLOUDINARY_IMAGE_URL'),
                    image: User.photo
                }

                Object.assign(user, {photo, token})

                return response.status(200).json({status:true, user})
        } catch (error) {
            return response.status(501).json({
                status: false, 
                message: 'Invalid Details, please check if email or password are correct, if issues persit please contact support.', 
                hint: error.message
            })
        }
    }

    async cacPermitCode () {
        const cacPermitCode = `cac-${await this.stringGenerator(20)}`
        const checkIfExist = await BiznessAcquired.findBy('inapp_cac_url_token', cacPermitCode)
        if(checkIfExist) {
            if(this.cacCodeBreakOut < 3) {
                this.cacCodeBreakOut++;
                await this.cacPermitCode();
            }
        }
        return cacPermitCode;
    }

    async  tinPermitCode () {
        const tinPermitCode = `tin-${await this.stringGenerator(20)}`
        const checkIfExist = await BiznessAcquired.findBy('inapp_tin_url_token', tinPermitCode)
        if(checkIfExist) {
            if(this.tinCodeBreakOut < 3) {
                this.tinCodeBreakOut++;
                await this.tinPermitCode(); 
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
