// import wsClient from '../wsClient';
import dotenv from 'dotenv';
import {AppLogger} from "../logger";
import {MessageTypes, WsClient} from "../ws/client";
import {CreateVirtualEnvQueue} from "../jobs/CreateVirtualEnvQueue";
import {SendWsQueue} from "../jobs/SendWsQueue";

dotenv.config();

( async ()=>{
    try {
       //  await createConnection();
       //
       //  //await createConnection();
       //  // example ws usage
       //  // wsClient.send({ id: 1, data: { done: true } });
       //  //await createBranch();
       //  const infraService = new MicroInfraService();
       //  const a = await infraService.getRepo('prometey-test-1')
       // // fs.appendFileSync('./client.zip', Buffer.from(a.data));
       //  var zip = new AdmZip(Buffer.from(a.data, "utf-8"));
       //  //console.log(zip.getEntry('airslateinc-airslate-microservices-infra-7495cdef9243080e05fbdda7966c19124d036915/api/'))
       //
       //  var zipEntries = zip.getEntries(); // an array of ZipEntry records
       //  let paths = []
       //  zipEntries.forEach(function (zipEntry) {
       //      const str = zipEntry.entryName.toString("utf8")
       //      //console.log(zipEntry.entryName.toString("utf8"))
       //      paths.push(zipEntry.entryName.toString("utf8"))
       //      //console.log(zipEntry.entryName)
       //      //console.log(zipEntry.toString()); // outputs zip entries information
       //      if (zipEntry.entryName === "airslateinc-airslate-microservices-infra-ef235f8efb84287a9581f103e462af40199fce67/utils/") {
       //         // console.log(zipEntry)
       //          //console.log(zipEntry.getData().toString("utf8"));
       //      }
       //  });
       //
       //  function filePathObject (arr) {
       //      const ret = {};
       //      arr.forEach((path) => {
       //          const dirs = path.split('/');
       //          const filename = dirs.pop();
       //          let dirObject = ret;
       //          dirs.forEach((dir, i) => {
       //              if (i === dirs.length - 1) {
       //                  dirObject[dir] = dirObject[dir] || [];
       //                  if (filename !== '') dirObject[dir].push(filename);
       //              } else {
       //                  dirObject[dir] = dirObject[dir] || {};
       //              }
       //              dirObject = dirObject[dir];
       //          });
       //      });
       //
       //      return ret;
       //  }
       //
       //  //console.log(paths)
       //  // let map = filePathObject(paths)
       //  // map = map[Object.keys(map)[0]];
       //  // console.log(map['api']['slates']['stage'])
       //  // const used = process.memoryUsage().heapUsed / 1024 / 1024;
       //  // console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
       //
       //  const srv = new MicroInfraRepoService();
       //  await srv.getRepo('prometey-test-1')
       //  // console.log(srv.getRepoTree())
       //  // console.log(srv.getRootNodeKey())
       //  // console.log(srv.getFileByPath('api/slates/stage/values.yaml'))
       //  //console.log(srv.getAllServices())
       //  console.log(srv.getAllValues())


        //
        // const ws = new WebSocket('ws://localhost:8888');
        //
        // ws.on('open', function open() {
        //     console.log('open')
        //     ws.send('something');
        // });
        //
        // ws.on('message', function message(data) {
        //     //ws.send('something1');
        //     console.log('received: %s', data);
        // });

        // const ws = new WsClient();
        // await ws.sendMessage({
        //     data: {
        //         msg: 'hello'
        //     },
        //     type: MessageTypes.data
        // })
        // ws.close()
        //
        //
        const newQueue = new SendWsQueue()
        newQueue.send({
            data: {hello:'1'},
            type: MessageTypes.data
        })

        // const wsClient = new WsClient();
        // await wsClient.sendMessage(
        //     {
        //         data: {hello:'1'},
        //         type: MessageTypes.data
        //     }
        // )
        //wsClient.close()
    } catch (e) {
        AppLogger.log({
            level: 'error',
            message: `Error ${e}`
        });
        console.log(e)
        throw Error(e);
    }

})();
