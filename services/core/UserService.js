const BaseService = require('../BaseService');
const {
    User,
} = require("../../db/models/index");
const bcrypt = require('bcrypt')
const {ROLES_NAMES} = require('../../config/auth/roles')

class UserService extends BaseService {

    async register(data) {
        try {
            const checkEmail = await this.getUserByEmail(data.email)
            if (checkEmail)
                throw new this.ValidationError(0, `this email already exist`)
            data.password = await this.generateHashPassword(data.password)
            data.roles = [ROLES_NAMES.CUSTOMER]
            const user = await User.create(data);
            return user
        } catch (e) {
            throw e
        }

    }

    async login(data) {
        const user = await User.getOne({
            where: {
                email: data.email
            }
        });
        if (!user) {
            throw new this.NotFoundError(0, `user does not exists`, 'المستخدم غير موجود');
        }
        await this.checkLoginPassword(data.password, user.password)

        return user;
    }

    async generateHashPassword(password) {
        return new Promise((resolve, reject) => {
                bcrypt.genSalt(10, async (err, salt) => {
                    if (err)
                        reject(err)
                    const hashedPass = await bcrypt.hash(password, salt);
                    resolve(hashedPass)
                });

            }
        )
    }

    async create(data) {
        return await User.create(data)
    }

    async getUserByEmail(email) {
        return await User.getOne({where: {email: email}})
    }

    async checkLoginPassword(givenPass, originalPass) {
        const match = await bcrypt.compare(givenPass, originalPass);
        if (!match) {
            throw new this.ValidationError(0, `email or password is not correct...please try again`, 'الايميل او الرقم السري غير صحيح');
        }
        return
    }

}

module.exports = new UserService()