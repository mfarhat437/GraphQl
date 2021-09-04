const {GraphQLObjectType, GraphQLString, GraphQLInt} = require("graphql");
const userType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        token: {type: GraphQLString},
    })
})
module.exports={
    userType
}