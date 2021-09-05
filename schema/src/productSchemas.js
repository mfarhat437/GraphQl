const BaseSchema = require('../BaseSchema')
const {GraphQLString, GraphQLList, GraphQLInt} = require('graphql')
const ProductService = require('../../services/core/ProductService')
const {productType} = require('../../config/types/product')
const {productSchema, productsFilterSchema} = require('../../validations/product')
const RESOURCE_NAMES = require("../../config/auth/resource_names");
const BaseSchemaImplementation = require("./BaseSchemaImplementation");

class productSchemas extends BaseSchemaImplementation {
    constructor() {
        super();
    }

    static rootQuery() {
        return {
            fields: {
                getProducts: {
                    type: new GraphQLList(productType),
                    args: {
                        seller: {type: GraphQLString},
                        priceOrder: {type: GraphQLString},
                    },
                    async resolve(parent, args, req) {
                        await req.validate(productsFilterSchema, args)
                        return await ProductService.getProducts(args)
                    }


                }
            }
        }
    }

    static rootMutation() {
        return {
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
    }
}

module.exports = new BaseSchema(productSchemas.rootQuery(), productSchemas.rootMutation())
