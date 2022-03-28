
import type { clientStateType } from '../shared/types.js'

import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { ExtendedObject3D } = AmmoNodeJS;

import { objects } from './updates.js'
import { createPlayer } from './handlers/player.js';

export function setClientState(worldObjectID: string, data: clientStateType) {
    objects[worldObjectID].clientState = data
}

export async function addPlayerToWorld(worldObjectID: string, physics: any, factory: any) {
    console.log("Player Count: " + Object.values(objects).length);

    const playerProps = await createPlayer(worldObjectID, physics)
    objects[playerProps.common.id] = playerProps;
}

export async function removePlayer(worldObjectID: string, physics: AmmoNodeJS.Physics) {
    console.log("destroy player");

    const extendedObject3D: AmmoNodeJS.ExtendedObject3D = objects[worldObjectID].object3d ?? new ExtendedObject3D();
    physics.destroy(extendedObject3D);
    delete objects[worldObjectID];
}