
import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { ExtendedObject3D } = AmmoNodeJS;
import { sendObjects } from './coms.js';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { internalObjectsServer, internalObjectServer, propsAll, getAllPropsArray, updateAllProps } from '../shared/props.js'
import type { clientStateType } from '../shared/props.js'
import { setClientState } from './interactions.js'

const SI = new SnapshotInterpolation();

export var objects: internalObjectsServer = {};


let DELETE_THIS: number | undefined = 0;

let tick = 0;

export function objectUpdates(delta: number, updateOnTick: number) {

    const tester = objects["book"];
    //const tester = objects["box"];

    if ((tester.object?.position.y ?? 0) > -20 && DELETE_THIS !== (tester.object?.position.y ?? 0)) {
        console.log(tester.object?.position.y);
        DELETE_THIS = tester.object?.position.y
    }

    handleClientStates(delta)

    // Update the storage props from the object referance before doing anything with the props data.
    updateAllProps(objects);


    // Only update on ticks
    tick++

    // only send the update to the client at 30 FPS (save bandwidth)
    if (tick % updateOnTick !== 0) return


    //let readableProps: propsReadableServer[] = buildReadableArray(objects);
    let allPropsArray: propsAll[] = getAllPropsArray(objects);

    const snapshot = SI.snapshot.create(allPropsArray);
    SI.vault.add(snapshot);

    sendObjects(snapshot);

    // Disable buffer for now. This saves or cpu but loses on bandwidth. Also can send booleans without the buffer
    // IMPORTANT REMOVE BOOLEANS BEFORE DOING BUFFER LOGIC
    //const buffer = buildBuffer(objects)
}

function handleClientStates(delta: number) {
    Object.values(objects).map(function (obj) {
        if (obj.clientState === undefined) return

        if (obj.clientState.movement === undefined) return
        movePlayer(obj.common.id, obj.clientState.movement)

        if (obj.clientState.angularVelocity === undefined) return
        rotatePlayer(obj.common.id, obj.clientState.angularVelocity)

        if (obj.clientState.doJump === undefined) return
        jumpPlayer(delta, obj)
    })
}

function movePlayer(worldObjectID: string, data: any) {
    try {
        if (objects[worldObjectID] === undefined) return
        if (objects[worldObjectID].object === undefined) return

        objects[worldObjectID].object?.body.setVelocityX(data.x)
        //objects[worldObjectID].object?.body.setVelocityY(data.y)
        objects[worldObjectID].object?.body.setVelocityZ(data.z)
        //console.log("player movement 111: " + data.x);
        //console.log("player movement: " + objects[worldObjectID].object?.body.position.x);
        //console.log("player movement: " + objects[worldObjectID].object?.body.velocity.x);
    } catch (e) {
        console.log("Move Player Error: " + e)
    }
}

function rotatePlayer(worldObjectID: string, data: any) {
    try {
        if (data === undefined) return
        if (objects[worldObjectID] === undefined) return
        if (objects[worldObjectID].object === undefined) return
        if (objects[worldObjectID].object?.body === undefined) return
        if (objects[worldObjectID].object?.body.angularVelocity === undefined) return

        const angularVelocityX: number = data.x ?? objects[worldObjectID].object?.body.angularVelocity.x
        const angularVelocityY: number = data.y ?? objects[worldObjectID].object?.body.angularVelocity.y
        const angularVelocityZ: number = data.z ?? objects[worldObjectID].object?.body.angularVelocity.z

        objects[worldObjectID].object?.body.setAngularVelocityX(angularVelocityX)
        objects[worldObjectID].object?.body.setAngularVelocityY(angularVelocityY)
        objects[worldObjectID].object?.body.setAngularVelocityZ(angularVelocityZ)
    } catch (e) {
        console.log("Rotate Player Error: " + e)
    }
}

function jumpPlayer(delta: number, obj: internalObjectServer) {
    const book = objects["book"].object

    if (book !== undefined) {
        obj.object?.body.on.collision((otherObject, event) => {
            console.log("this and: " + otherObject.name + " " + event)
        })
    }


    // Set jump parameters
    if (obj.clientServerState === undefined) {
        var newDoJump = {
            startTime: 0,
            currentTime: 0,
            duration: 1,
        }
        obj.clientServerState = { doJump: newDoJump }
    }

    if (obj.clientServerState.doJump.startTime > 0) {
        obj.clientServerState.doJump.startTime -= delta


        if (obj.clientServerState.doJump.startTime < 0) {
            obj.clientServerState.doJump.startTime = 0
        }
    }

    try {
        if (obj.clientState === undefined) return
        if (obj.clientState.doJump === undefined) return

        if (obj.clientState.doJump) {

            if (obj.clientServerState.doJump.startTime === 0) {
                obj.clientServerState.doJump.startTime = obj.clientServerState.doJump.duration;

                obj.object?.body.applyForceY(6)
            }
        }

    } catch (e) {
        console.log("Jump Player Error: " + e)
    }
}