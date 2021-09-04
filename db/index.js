const DB_RETRIES = 30;
const DB_WAIT_TIME = 2000;
const {Sequelize} = require('sequelize');
const config = require('../config/index')

class Database {
    constructor() {
        this._initialized = false;
        this._connection = undefined;
        this._retries = 0;
    }

    /**
     * Register all models in ./models directory
     * Note: Does not work recursively
     * @private
     */

    async _registerModels() {
        require('./models/user')
        require('./models/product')

    }

    async _connect(uri, options) {
        try {
            return await new Promise(async (resolve, reject) => {
                const sequelize = new Sequelize(config.db.db_name, config.db.username, config.db.password, {
                    host: config.db.url,
                    dialect: 'mysql',
                    port: 3306,
                    pool: {
                        max: 15,
                        min: 5,
                        idle: 20000,
                        evict: 15000,
                        acquire: 30000,
                        max_user_connections: 10
                    },
                    connectTimeout: 30000

                })
                try {
                    await sequelize.authenticate();


                    resolve(sequelize)
                    console.log('Connection has been established successfully.');
                } catch (error) {
                    console.error('Unable to connect to the database:', error);
                    reject(error)
                }

            });
        } catch (err) {
            if (this._retries >= DB_RETRIES) {
                console.log("Waiting timeout");
                throw err;
            }

            this._retries += 1;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(`Waiting for database, Reason: ${err.message}`);
                    resolve(this._connect(uri, options));
                }, DB_WAIT_TIME);
            });
        }
    }

    async initialize(dbConfig) {
        if (this._initialized) {
            return;
        }

        // Register models
        // await this._registerModels();

        const uri = dbConfig.url;
        const options = {
            autoIndex: false, // Don't build indexes "Production"
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 1000, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            useNewUrlParser: true,
            socketTimeoutMS: 30000,
            keepAlive: 300000

        };

        const connection = await this._connect(uri, options);
        await connection.sync()
        this._initialized = true;
        this._connection = connection;
        await this._registerModels();

        return connection
    }

    get connection() {
        return this._connection
    }

    get isInitialized() {
        return this._initialized;
    }


}

module.exports = new Database();
