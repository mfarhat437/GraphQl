const BaseSchema = require('../BaseSchema')
const {GraphQLString} = require('graphql')
const UserService = require('../../services/core/UserService')
const {userType} = require('../../config/types/user')
const {registrationSchema, loginSchema} = require('../../validations/userValidation')
const BaseSchemaImplementation = require('./BaseSchemaImplementation')

class userSchemas extends BaseSchemaImplementation {
    constructor() {
        super();
    }

    static rootQuery() {
        return {}
    }

    static rootMutation() {

        return {
            fields: {
                registerUser: {
                    type: userType,
                    args: {
                        name: {type: GraphQLString},
                        email: {type: GraphQLString},
                        password: {type: GraphQLString},
                    },

                    async resolve(parent, args, req) {
                        await req.validate(registrationSchema, args)
                        return await UserService.register(args)
                    }
                },
                login: {
                    type: userType,
                    args: {
                        name: {type: GraphQLString},
                        email: {type: GraphQLString},
                        password: {type: GraphQLString},
                    },

                    async resolve(parent, args, req) {
                        await req.validate(loginSchema, args)
                        return await UserService.login(args)
                    }
                }
            }
        };
    }
}

module.exports = new BaseSchema(userSchemas.rootQuery(), userSchemas.rootMutation())
