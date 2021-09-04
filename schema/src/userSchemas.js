const BaseSchema = require('../BaseSchema')
const {GraphQLString} = require('graphql')
const UserService = require('../../services/core/UserService')
const _ = require('lodash')
const {userType} = require('../../config/types/user')
const {registrationSchema, loginSchema} = require('../../validations/userValidation')


const rootQuery = {}
const rootMutation = {
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
// console.log('rootMutation : ',GraphQLObjectType)
module.exports = new BaseSchema(rootQuery, rootMutation)
// module.exports=new GraphQLSchema({
//     query:rootQuery,
//     mutation:rootMutation
// })