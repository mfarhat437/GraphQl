const {GraphQLObjectType, GraphQLString, GraphQLInt} = require("graphql");
const productType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        price: {type: GraphQLInt},
        seller: {type: GraphQLString},
    })
})
module.exports = {
    productType
}