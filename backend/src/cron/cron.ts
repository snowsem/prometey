import dotenv from 'dotenv';
import {createConnection} from "typeorm";

dotenv.config();
import cron from 'node-cron';
import {AppLogger} from "../logger";
import {importAllServices} from "./importAllServices";

( async ()=>{
    try {
        await createConnection();
        //*/10 * * * * will run every 10 min.
        //*/10 * * * * * will run every 10 sec.
        const importServices = cron.schedule('*/10 * * * * *', async () =>  {

            const res = await importAllServices();
            AppLogger.log({
                level: 'info',
                message: `Load all services by cron; count record: ${res.length}`
            });
        });
    } catch (e) {
        AppLogger.log({
            level: 'error',
            message: `Error ${e}`
        });
        throw Error(e);
    }

})();