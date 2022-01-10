import dotenv from 'dotenv';

dotenv.config();
import cron from 'node-cron';
import {AppLogger} from "../logger";
import {importAllServices} from "./importAllServices";
import {createBranch} from "./createBranch";
import {createConnection} from "typeorm";
import {CreateVirtualEnvQueue} from "../jobs/CreateVirtualEnvQueue";
import {DeleteVirtualEnvQueue} from "../jobs/DeleteVirtualEnvQueue";


const cronApp = async ()=>{
    try {
        await createConnection();
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

        const createEnvQueue = new CreateVirtualEnvQueue();
        const deleteEnvQueue = new DeleteVirtualEnvQueue();
        createEnvQueue.run();
        deleteEnvQueue.run();

    } catch (e) {
        AppLogger.log({
            level: 'error',
            message: `Error ${e}`
        });
        throw Error(e);
    }

}
cronApp()
export default cronApp;
