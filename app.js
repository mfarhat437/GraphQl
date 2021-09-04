require('dotenv').config();
const http = require('http');
const express = require('express');
const config = require('./config');
const db_connection = require('./db/index');
const utils = require('./helpers/utils');

class Server {
    constructor(_config) {
        this.config = _config;
        this.app = express();
        this.server = http.createServer(this.app)
    }

    async preInitialize() {
        try {
            await db_connection.initialize(this.config.db);

        } catch (err) {
            console.log(err);
            process.exit(1);
        }
        const expressRouter = require('./routes/index');

        const expressConfig = require('./config/express');
        expressConfig(this.app, expressRouter, this.config);
    }

    async start() {
        await this.preInitialize();

        await new Promise((resolve, reject) => {
            this.server.on('error', (err) => {
                if (err.syscall !== 'listen') {
                    return reject(err);
                }

                // handle specific listen errors with friendly messages
                switch (err.code) {
                    case 'EACCES':
                        console.error(`port ${err.port} requires elevated privileges`);
                        process.exit(1);
                        break;
                    case 'EADDRINUSE':
                        console.error(`port ${err.port} is already in use`);
                        process.exit(1);
                        break;
                    default:
                        reject(err);
                }
            });

            this.server.on('listening', () => {
                resolve();
            });

            this.server.listen(this.config.port);
        });

        const info = this.server.address();

        console.log(`Running API server at ${info.address}:${info.port} on ${config.NODE_ENV}`);
    }

    async stop() {
        if (!utils.inDevelopment() && !utils.inTest()) {
            return;
        }

        if (this.server && this.server.listening) {
            this.server.close();
        }
    }

}

const server = new Server(config);

if (!module.parent) {
    server.start();
}

module.exports = server;
