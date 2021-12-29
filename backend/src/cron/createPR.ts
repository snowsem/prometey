
const createPr = ()=>{
    
}


import dotenv from 'dotenv';
import {createConnection} from "typeorm";

dotenv.config();
import {AppLogger} from "../logger";


( async ()=>{
    try {
        await createConnection();

    } catch (e) {
        AppLogger.log({
            level: 'error',
            message: `Error ${e}`
        });
        throw Error(e);
    }

})();