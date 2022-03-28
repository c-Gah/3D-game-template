import type { Scene3D } from 'enable3d';
import type { clientStateType } from '../../../server/src/shared/types'
import socketIOClient, { Socket } from 'socket.io-client';
import { SI } from './updates';
import { setPlayableCharacterID } from './handlers/PlayablePlayer'

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
        // Add the snapshot
        SI.snapshot.add(snapshot);

        socket.emit('clientState', clientState);
        resetClientState()
    })

    return socket.id;
}

export function sendMovement(isMoving: boolean, theta: number) {
    const toSend = { isMoving: isMoving, theta: theta }
    clientState.movement = toSend
}

export function sendRotation(x: number, y: number, z: number) {
    const toSend = { x: x, y: y, z: z }
    clientState.rotation = toSend
}

export function sendJump(doJump: boolean) {
    clientState.doJump = doJump
}

function resetClientState() {
    clientState.doJump = false
}