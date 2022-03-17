import socketIOClient, { Socket } from 'socket.io-client';
import type { Scene3D } from 'enable3d';
import { setPlayableCharacterID, addSnapshot } from './map';
import type { clientStateType } from '../../../server/src/shared/props'

// emits are send from other classes
const ENDPOINT = 'http://localhost:5000'; //endpoint port 5000

var socket: Socket;
var clientState: clientStateType = {}

export function setupComs(scene: Scene3D) {
    socket = socketIOClient(ENDPOINT);

    console.log("Connecting to server");
    socket.on('connected', (data) => {
        console.log("connected to server: " + data);

        setPlayableCharacterID(socket.id);
    });

    socket.on('snapshot', snapshot => {
        //console.log(snapshot)
        addSnapshot(snapshot);

        socket.emit('clientState', clientState);
        resetClientState()
    })

    return socket.id;
}

export function sendMovement(x: number, y: number, z: number) {
    const toSend = { x: x, y: y, z: z }
    clientState.movement = toSend
    //socket.emit('movement', toSend);
}

export function sendAngularVelocity(x: number, y: number, z: number) {
    const toSend = { x: x, y: y, z: z }
    clientState.angularVelocity = toSend

}

export function sendJump(doJump: boolean) {
    clientState.doJump = doJump
}

function resetClientState() {
    clientState.doJump = false
}