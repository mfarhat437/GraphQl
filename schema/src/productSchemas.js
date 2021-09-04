const BaseSchema = require('../BaseSchema')
const {GraphQLString, GraphQLList, GraphQLInt, GraphQLEnumType} = require('graphql')
const ProductService = require('../../services/core/ProductService')
const {productType} = require('../../config/types/product')
const {ValidationError} = require('../../helpers/errors')
const {productSchema} = require('../../validations/product')
const RESOURCE_NAMES = require("../../config/auth/resource_names");

const rootQuery = {
    fields: {
        getProducts: {
            type: new GraphQLList(productType),
            args: {
                seller: {type: GraphQLString},
                priceOrder: {type: GraphQLString},
            },
            async resolve(parent, args) {
                return await ProductService.getProducts(args)
            }


        }
    }
}
const rootMutation = {
    fields: {
        createProduct: {
            type: productType,
            args: {
                name: {type: GraphQLString},
                price: {type: GraphQLInt},
            },

            async resolve(parent, args, req) {
                try {
                    await req.isAuthenticated(req)
                    console.log('user : ', req.user.roles)
                    await req.authorize(req.user, RESOURCE_NAMES.PRODUCT, ['createAny'])
                    await req.validate(productSchema, args)
                    args.seller = req.user.id
                    return await ProductService.create(args)
                } catch (e) {
                    throw e
                }
            }
        },

    }
};
module.exports = new BaseSchema(rootQuery, rootMutation)
