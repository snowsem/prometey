import dotenv from 'dotenv';
import express from 'express';
import { createConnection } from 'typeorm';
import bodyParser from "body-parser";
import router from './router';
import passport from 'passport'

dotenv.config();
createConnection().then(connection => {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(passport.initialize())
    const port = 8888; // default port to listen
    app.use(router);
    dotenv.config();
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
}).catch(e=>console.log(e));