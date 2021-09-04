const {userSchema, userRootMutation} = require('./src/userSchemas')

class BaseSchema {

    async prepareRootMutation() {
        return `type RootMutation {
        ${userRootMutation}
        }`
    }

    async finalSchema() {


    }

}
