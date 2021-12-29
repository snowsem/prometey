import dotenv from 'dotenv';

dotenv.config();
import cron from 'node-cron';
import {AppLogger} from "../logger";
import {importAllServices} from "./importAllServices";
import {createBranch} from "./createBranch";

const cronApp = async ()=>{
    try {
        //*/10 * * * * will run every 10 min.
        //*/10 * * * * * will run every 10 sec.
        const importServices = cron.schedule('1 * * * *', async () =>  {

            const res = await importAllServices();
            AppLogger.log({
                level: 'info',
                message: `Load all services by cron; count record: ${res.length}`
            });
        });

        const createBranchCron = cron.schedule('* * * * *', async () =>  {

            const res = await createBranch();
            AppLogger.log({
                level: 'info',
                message: `Update envs in git`
            });
        });
    } catch (e) {
        AppLogger.log({
            level: 'error',
            message: `Error ${e}`
        });
        throw Error(e);
    }

}

export default cronApp;
