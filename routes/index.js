const fs = require('fs');
const path = require('path');
const _ = require('lodash')
const express = require('express');
const {authentication, hooks, language} = require('../controller/middlewares');
const utils = require('../helpers/utils');
const schemaDir = '../schema/src';
const {graphqlHTTP} = require('express-graphql')
const {GraphQLSchema, GraphQLObjectType} = require("graphql");

// const d= require('../../')
class Router {
    constructor(app, config) {
        this.app = app;
        this.config = config;
    }

    initialize() {
        this.app.use(function (req, res, next) {

            res.setHeader('Access-Control-Allow-Origin', '*');

            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });

        this.app.use(hooks);
        this.app.use(language);
        this.initDocs();
        let rootQuery = {name: "RootQuery"};
        let rootMutation = {name: "RootMutation"};
        const dir = path.join(__dirname, schemaDir);
        this.schema = this.getSchemas(dir, rootQuery, rootMutation);
        this.app.use(authentication)
        this.app.use('/graphql', graphqlHTTP({
                graphiql: true,
                schema: this.schema,
                formatError(err) {
                    if (!err.originalError)
                        return err
                    const data = err.originalError.data
                    const message = err.message || 'error occurred';
                    const code = err.originalError.code || 500
                    return {message: message, status: code, data: data}
                },

            })
        );
    }

    getSchemas(dir, rootQuery, rootMutation) {

        const files = fs.readdirSync(dir);
        for (let i = 0; i < files.length; i++) {
            const schemaDir = path.join(dir, files[i]);
            console.log('schema dir', schemaDir)

            const schema = require(schemaDir);
            rootMutation = _.merge(rootMutation, schema.rootMutation);
            rootQuery = _.merge(rootQuery, schema.rootQuery);
        }
        const schema = new GraphQLSchema({
            query: new GraphQLObjectType(rootQuery),
            mutation: new GraphQLObjectType(rootMutation)
        })
        return schema
    }

    injectControllers(controllers) {
        for (let i = 0; i < controllers.length; i++) {
            this.app.use(controllers[i].url, controllers[i].router);
        }
    }

    initDocs() {
        if (utils.inDevelopment()) {
            const files = path.join(__dirname, '../docs/swagger-ui');
            const pu = path.join(__dirname, '../public');
            const oaSpecs = path.join(__dirname, '../api.yaml');
            this.app.use('/swagger-ui', express.static(files));
            this.app.use('/swagger-ui/api.yaml', express.static(oaSpecs));
            this.app.use('/pu/', express.static(pu));
        }
    }


}

module.exports = Router;
