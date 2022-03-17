import type { Project, PhysicsLoader, Scene3D, ExtendedObject3D, THREE, JoyStick, ThirdPersonControls, PointerLock, PointerDrag } from 'enable3d';
import { loadAssets } from './assets'
import { updatePlayerChar, makePlayable } from './objects/makePlayable'
import { addBook } from './objects/book'
import { addBox, addBox2 } from './objects/box'
import { addPlayer } from './objects/player'
import { SnapshotInterpolation, Types } from '@geckos.io/snapshot-interpolation';
import type { internalObjectClient, internalObjectsClient, propsAll } from '../../../server/src/shared/props'

let objects: internalObjectsClient | string = {};
const SI = new SnapshotInterpolation();

let playerId: string;

export function setPlayableCharacterID(id: string) {
    playerId = id
}

export async function createObjects(scene3D: Scene3D) {

    const { lights } = await scene3D.warpSpeed('-ground', '-orbitControls')

    const { hemisphereLight, ambientLight, directionalLight } = lights
    const intensity = 0.65
    hemisphereLight.intensity = intensity
    ambientLight.intensity = intensity
    directionalLight.intensity = intensity

    // scene3D.physics.debug.enable()

    setTimeout(() => {
        const placeholder = document.getElementById('welcome-game-placeholder')
        if (placeholder) placeholder.remove()
    }, 500)
}

let DELETE_THIS = 0;

export function objectUpdate(time, delta, scene: Scene3D) {

    //const snapshot = SI.calcInterpolation('x y z') // interpolated
    const snapshot: Types.Snapshot = SI.vault.get() // latest
    if (snapshot) {
        // @ts-expect-error
        snapshot.state.forEach(async (objectProps: propsAll) => {

            //snapshot.state.forEach((objectProps: Types.Entity) => {
            if (objects[objectProps.id] === undefined) {
                await handleObjectCreation(scene, objectProps)
            }
        })
    }



    const snapshot2 = SI.calcInterpolation('x y z angularVelocityX angularVelocityY angularVelocityZ') // interpolated
    //const snapshot: Types.Snapshot = SI.vault.get() // latest
    if (snapshot2) {
        const { state } = snapshot2

        type eachState = {
            id: string,
            x: number, y: number, z: number
            angularVelocityX: number, angularVelocityY: number, angularVelocityZ: number
        };

        state.forEach((objectProps: eachState) => {

            // DO i need this at all??
            if (objects[objectProps.id] === undefined) {
                return
            } else if (typeof objects[objectProps.id] === "string") {
                console.log("Object still being defined 222222");

            } else {
                if (objects[objectProps.id].object === undefined) return
                if (objects[objectProps.id].object.body === undefined) return

                const deltaSeconds = delta / 1000

                /*
                console.log("13214342543");
                console.log(objects[objectProps.id]);
                console.log(objects[objectProps.id].object);
                console.log(objects[objectProps.id].object.body);
                console.log(objects[objectProps.id].object.body.getCollisionFlags());
                */

                if (objects[objectProps.id].object.body.getCollisionFlags() === 0) {

                    //console.log("11111111111111");

                    objects[objectProps.id].object.body.setVelocity(0, 0, 0)
                    objects[objectProps.id].object.body.setAngularVelocity(0, 0, 0)

                    const offsetX = objectProps.x - objects[objectProps.id].object.position.x
                    const offsetY = objectProps.y - objects[objectProps.id].object.position.y
                    const offsetZ = objectProps.z - objects[objectProps.id].object.position.z

                    objects[objectProps.id].object.body.applyForceX(offsetX * delta)
                    objects[objectProps.id].object.body.applyForceY(offsetY * delta)
                    objects[objectProps.id].object.body.applyForceZ(offsetZ * delta)

                    objects[objectProps.id].object.body.setAngularVelocityX(objectProps.angularVelocityX)
                    objects[objectProps.id].object.body.setAngularVelocityY(objectProps.angularVelocityY)
                    objects[objectProps.id].object.body.setAngularVelocityZ(objectProps.angularVelocityZ)
                }


                DELETE_THIS += delta
                if (DELETE_THIS > (5000 + (Math.random() * 10))) {
                    DELETE_THIS = 0

                    console.log("Here to update the position of the object");
                }
            }
        })

    }



    if (playerId === undefined) return
    if (objects[playerId] === undefined) return
    if (typeof objects[playerId] === "string") {
        console.log("GET OUTA HERE 2333333333333333333333333333333333333333333");
        return
    }

    updatePlayerChar(time, delta, scene, objects[playerId].object);
}

async function handleObjectCreation(scene: Scene3D, objectProps: any) {
    objects[objectProps.id] = "defining";

    try {
        console.log("create the object provided");

        let obj: ExtendedObject3D;
        if (objectProps.asset === "ground") {
            obj = await addBox2(scene, objectProps)
        } else if (objectProps.asset === "box") {
            obj = await addBox2(scene, objectProps)
        } else if (objectProps.asset === "book") {
            obj = await addBook(scene, objectProps)
        } else if (objectProps.asset === "box_man") {
            obj = await addPlayer(scene, objectProps)

            if (objectProps.id === playerId) {
                console.log("make playable 11111111111111111111111111111111111");
                makePlayable(scene, obj)
            }
        }

        let objectRecord: internalObjectClient = { object: obj, props: objectProps }
        objects[objectProps.id] = objectRecord;
    } catch (e) {
        console.log("Error creating serer object: " + e);
    }
}

export function addSnapshot(snapshot: any) {
    SI.snapshot.add(snapshot);
}