import type { clientStateType } from '../shared/props.js'

import express from 'express';
import { Server, Socket } from 'socket.io';
import http, { createServer } from 'http';
import path from 'path';

import { addPlayerToWorld, setClientState, removePlayer } from './interactions.js'


let ioSocket: Server;

/* 
Server Function 
*/
export function startComs(physics: any, factory: any) {
    let httpServer = startExpress();

    startSocketIO(httpServer, physics, factory);
}

function startExpress() {
    const expressServer = express();
    const httpServer = createServer(expressServer);


    /* start server functions */
    const __dirname = path.resolve();

    expressServer.use(express.static(path.join(__dirname, 'src')));
    // sendFile will go here
    expressServer.get('/a', function (req, res) {
        res.sendFile(path.join(__dirname, 'build/client/index.html'));
    });


    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
        console.log('Server started at http://localhost:' + PORT);
    });

    return httpServer;
}

function startSocketIO(httpServer: http.Server, physics: any, factory: any) {
    const io = new Server(httpServer, { cors: { origin: '*' } });

    io.on('connection', async (socket: Socket) => {
        console.log('Connection established: ' + socket.id);
        socket.emit('connected', "Welcome");

        await addPlayerToWorld(socket.id, physics, factory);

        socket.on("clientState", async (data: clientStateType) => {
            setClientState(socket.id, data)
        });

        socket.on("disconnect", async (reason) => {
            console.log('Player disconnected: ' + reason);
            await removePlayer(socket.id, physics);
        });
    });

    ioSocket = io;
}

export function sendObjects(snapshot: any) {
    ioSocket.emit('snapshot', snapshot);
}