// import wsClient from '../wsClient';


import dotenv from 'dotenv';
import {createConnection} from "typeorm";

dotenv.config();
import {AppLogger} from "../logger";
import {createBranch} from "./createBranch";


( async ()=>{
    try {
        await createConnection();
        // example ws usage
        // wsClient.send({ id: 1, data: { done: true } });
        await createBranch();
    } catch (e) {
        AppLogger.log({
            level: 'error',
            message: `Error ${e}`
        });
        console.log(e)
        throw Error(e);
    }

})();
