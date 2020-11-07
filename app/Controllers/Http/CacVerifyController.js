'use strict'
const axios = use('axios')
const BiznessAcquired = use('App/Models/BiznessAcquired')

class CacVerifyController {


    async regVerify(cac, bizName) {

        const verifyStatus = await this.verify(cac, bizName)

        if(verifyStatus.status) {
            
           return {status: true, message: 'verified', verifyStatus,  status_code: 200}
        }
    
        return {status: false, message: 'Not Verified', verifyStatus, status_code: 400}
    }

    async routeVerify({params: {cacPermitCode}, response}) {

        const findBizness = await BiznessAcquired.query().where('inapp_cac_url_token', cacPermitCode).first()


        const verifyStatus = await this.verify(findBizness.cac_number, findBizness.bizName)

        console.log(verifyStatus)

        if(verifyStatus.status) {
            
            return response.status(200).json({status: true, verifyStatus, message: 'verified' })
         }
     
         return response.status(400).json({status: true, verifyStatus, message: 'Not Verified' })
    }

    async verify(cacNumber, bizName) {

        try {
            const data = {
                rcNumber: cacNumber ? cacNumber : '31498',
                companyName: bizName ? bizName : 'Balinga Enterprises'
            };
    
            // set the headers
            const config = {
                headers: {
                    'userid': '1602247185181',
                    'api-key': 'YyZXEmaiRlHlHTuh',

                }
            };
            //call Api
            const result = await axios.post('https://app.verified.ng/rc', data, config)

            if(result.data){
                console.log(result.data)
                if(result.data.verified) {
                    return {
                        status: true,
                        message: data
                    }
                }
            }
            
            return {
                status: false,
                message: data
            }

        } catch (error) {
              return {
                status: false,
                message: 'CAC Identification Not Found',
                hint: error.message
            }
        }

    }
}

module.exports = CacVerifyController
