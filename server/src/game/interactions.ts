
import type { clientStateType } from '../shared/props.js'

import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { ExtendedObject3D } = AmmoNodeJS;

import { objects } from './updates.js'
import { createPlayer } from './objects/player.js';

export function setClientState(worldObjectID: string, data: clientStateType) {
    objects[worldObjectID].clientState = data
}

export async function addPlayerToWorld(worldObjectID: string, physics: any, factory: any) {
    console.log("Player Count: " + Object.values(objects).length);

    const playerProps = await createPlayer(worldObjectID, factory, physics)
    objects[playerProps.common.id] = playerProps;
}


export async function removePlayer(worldObjectID: string, physics: AmmoNodeJS.Physics) {
    console.log("destroy player");

    //fix the creating a player on player connect and three .add not finding somthing?? The GLB object?
    const extendedObject3D: AmmoNodeJS.ExtendedObject3D = objects[worldObjectID].object ?? new ExtendedObject3D();
    physics.destroy(extendedObject3D);
    delete objects[worldObjectID];
}