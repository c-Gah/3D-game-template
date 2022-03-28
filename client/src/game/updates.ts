import type { Scene3D } from 'enable3d';
import type { Types } from '@geckos.io/snapshot-interpolation';
import type { BaseHandler } from './handlers/base/BaseHandler'
import type { propsAll } from '../../../server/src/shared/types'

import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { buildPlayerObject } from './handlers/Player'
import { buildPlayablePlayerObject, playerId } from './handlers/PlayablePlayer'
import { Box } from './handlers/Box'
import { createBook } from './handlers/Book'


type objectsType = { [key: string]: BaseHandler }
let objects: objectsType | string = {};

export const SI = new SnapshotInterpolation();

export function worldUpdate(time: number, delta: number, scene: Scene3D) {
    handleObjectCreation(scene)
    handleObjectUpdates(delta)

    deleteUnusedObjects(scene)
}

async function handleObjectCreation(scene: Scene3D) {
    const snapshot: Types.Snapshot = SI.vault.get() // latest
    if (snapshot) {
        const state = snapshot.state as Types.State

        state.forEach(async (objectProps: propsAll) => {
            if (objects[objectProps.id] === undefined) {
                await createObject(scene, objectProps)
            }
        })
    }
}

async function createObject(scene: Scene3D, objectProps: any) {
    objects[objectProps.id] = "defining";

    try {
        //let obj: BaseHandler;
        let obj;
        if (objectProps.asset === "ground") {
            obj = new Box(scene, objectProps)
        } else if (objectProps.asset === "box") {
            obj = new Box(scene, objectProps)
        } else if (objectProps.asset === "book") {
            obj = await createBook(scene, objectProps)
        } else if (objectProps.asset === "box_man") {

            console.log(objectProps.id);
            console.log(playerId);
            if (objectProps.id === playerId) {
                obj = await buildPlayablePlayerObject(scene, objectProps)
                
            } else {
                obj = await buildPlayerObject(scene, objectProps)
            }
        }

        objects[objectProps.id] = obj
    } catch (e) {
        console.log("Error creating serer object: " + e);
    }
}

async function handleObjectUpdates(delta: number) {

    const snapshot2 = SI.calcInterpolation('x y z rotationX rotationY rotationZ') // interpolated
    if (snapshot2) {
        const { state } = snapshot2

        state.forEach((objectProps: propsAll) => {

            if (objects[objectProps.id] === undefined) return
            if (typeof objects[objectProps.id] === "string") return

            const object = objects[objectProps.id]

            object.update(delta, objectProps)
        })
    }
}

function deleteUnusedObjects(scene: Scene3D) {
    Object.values(objects).map(function (object: BaseHandler | string, index: number) {
        if (typeof object === "string") return

        const obj: BaseHandler = object

        if (obj.doDestroy) {
            const objectKey = Object.keys(objects)[index]

            scene.destroy(obj.object3d)
            scene.physics.destroy(obj.object3d)
            delete objects[objectKey]
        }
    })
}