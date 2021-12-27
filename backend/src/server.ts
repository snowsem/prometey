import dotenv from 'dotenv';
import express from 'express';
import { createConnection } from 'typeorm';
import bodyParser from "body-parser";
import router from './router';
import passport from 'passport'
import cors from 'cors'
import errorsMiddleware from './errorHandler';

dotenv.config();

async function startServer() {
    const app = express();
    await createConnection();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(passport.initialize())
    const port = 8888; // default port to listen
    app.use(router);
    app.use(errorsMiddleware);
    dotenv.config();
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
}


startServer().then();
