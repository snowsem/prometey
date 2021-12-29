// import wsClient from '../wsClient';

const createPr = ()=>{

}


import dotenv from 'dotenv';
import {createConnection} from "typeorm";

dotenv.config();
import {AppLogger} from "../logger";


( async ()=>{
    try {
        await createConnection();
        // example ws usage
        // wsClient.send({ id: 1, data: { done: true } });
    } catch (e) {
        AppLogger.log({
            level: 'error',
            message: `Error ${e}`
        });
        throw Error(e);
    }

})();
