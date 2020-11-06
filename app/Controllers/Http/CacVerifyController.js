'use strict'
const axios = use('axios')


class CacVerifyController {


    async regVerify(cac) {

        const verifyStatus = await this.verify(cac)

        if(verifyStatus.status) {
            
           return {status: true, message: 'verified', verifyStatus,  status_code: 200}
        }
    
        return {status: false, message: 'Not Verified', verifyStatus, status_code: 400}
    }

    async routeVerify({request, auth, prams: {cac}, response}) {

        const verifyStatus = await this.verify(cac)

        if(verifyStatus.status) {
            
            return response.status(200).json({status: true, verifyStatus, message: 'verified' })
         }
     
         return response.status(401).json({status: true, message: 'Not Verified' })
    }

    async verify(cac) {

        try {
            const data = {
                rcNumber: '31498',
                companyName: 'Balinga Enterprises'
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