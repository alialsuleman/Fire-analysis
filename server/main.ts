/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cluster from 'node:cluster';
const OS = require('node:os');
import { startServer } from './expressServer';
import { startAnalyser } from './analyser';
import { startGrpcServer } from './grpcServer';
import { sharedPostsQueue } from './Queues';
require('dotenv').config();

sharedPostsQueue;






if (cluster.isMaster) {

  //console.log('Hi  !! i am the master process 🤬 ,  with id ' + process.pid);

  let num_of_chiled = 0;
  while (num_of_chiled--) cluster.fork();
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
    cluster.fork() //forks a new process if any process dies
  })


  setTimeout(startAnalyser, 3000);
  setTimeout(startGrpcServer, 3000);

}
else {

  //console.log('Hi  !! i am child process 🐥,  with id   ' + process.pid);
}





