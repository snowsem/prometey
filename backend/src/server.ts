import dotenv from 'dotenv';
import express from 'express';
import { createConnection } from 'typeorm';
import http from 'http';
import bodyParser from "body-parser";
import router from './router';
import passport from 'passport'
import cors from 'cors'
import errorsMiddleware from './errorHandler';
import wsClient from './wsClient';
import cronApp from './cron/cron';

dotenv.config();

async function startServer() {
    await createConnection();
    const app = express();
    const server = http.createServer(app);

    wsClient.init(server);

    wsClient.on('connection', (ws) => {
        console.log('connected');
        wsClient.send('test');
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(passport.initialize())
    const port = 8888; // default port to listen
    app.use(router);
    app.use(errorsMiddleware);
    dotenv.config();
    server.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
    await cronApp();
}


startServer().then();
