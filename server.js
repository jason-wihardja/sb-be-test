'use strict';

/* eslint-disable no-console, no-inner-declarations */

global.Promise = require('bluebird');

const EventEmitter = require('events');

const exitHook = require('async-exit-hook');
exitHook.hookEvent('SIGUSR2', 0);

const os = require('os');
const cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_RR;

const Logger = require('./logger');

if (cluster.isMaster) {
    Logger.setup();
    let isExiting = false;

    const onlineWorkers = [];
    const exitedWorkers = [];
    const exitEmitter = new EventEmitter();

    const maxWorkers = os.cpus().length;

    async function onMessage(msg) {
        if (msg === 'ready' && isExiting === false) {
            onlineWorkers.push(this.process.pid);
            if (onlineWorkers.length === maxWorkers) {
                console.info('All Workers Online');
            }
        } else if (msg === 'shutdown') {
            exitedWorkers.push(this.process.pid);
            if (exitedWorkers.length === maxWorkers) {
                exitEmitter.emit('shutdown');
            }
        }
    }

    function forkWorker() {
        const worker = cluster.fork();
        worker.on('message', onMessage);
    }

    for (let i = 0; i < maxWorkers; i += 1) {
        forkWorker();
    }

    cluster.on('exit', (worker, code, signal) => {
        if (isExiting === false) {
            console.warn(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);

            let index = onlineWorkers.indexOf(worker.process.pid);
            if (index !== -1) onlineWorkers.splice(index, 1);

            index = exitedWorkers.indexOf(worker.process.pid);
            if (index !== -1) exitedWorkers.splice(index, 1);

            forkWorker();
        }
    });

    exitHook(async (callback) => {
        isExiting = true;

        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const id in cluster.workers) {
            cluster.workers[id].send('shutdown');
        }

        await new Promise((resolve) => {
            exitEmitter.on('shutdown', resolve);
        });

        console.info(`Master Process ${process.pid} Shutdown`);
        return callback();
    });
} else {
    require('./index');
}
