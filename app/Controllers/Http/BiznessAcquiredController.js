'use strict'
const BiznessAcquired = use('App/Models/BiznessAcquired')
const Database = use('Database')
const Env = use('Env')

class BiznessAcquiredController {


    async myBizNess({response, params: {page}, auth}) {

        const myBizNess = await BiznessAcquired.query()
                                            .where('user_id', auth.user.id)
                                            .with('user')
                                            .paginate(page, 50);
        response.status(200).json({
            success: true,
            info: 'Your Bizness Aquired',
            fileOrigin: {
                imageOrigin: Env.get('CLOUDINARY_IMAGE_URL')
            },
            yourBiznesses: myBizNess
        });
    
    }


    async regInsert(bizData) {

        const res = await this.store(bizData);

        return res;
    }

    async routeInsert({request, auth, response}) {

    }

    async store (data) {

        console.log(data)
        const trx = await Database.beginTransaction()

        try {
            const biznessAcquiredInfo = await BiznessAcquired.create(data, trx);

            await trx.commit()

            return { status: true, message: `Hurray! registration successful, Thank you.`, bizData: biznessAcquiredInfo, status_code: 201 }

        } catch (error) {
            await trx.rollback()

            return { status: false, message: 'An unexpected error occured when creating a rider.', hint: error.message, status_code: 501 }
        }
    }
}

module.exports = BiznessAcquiredController
