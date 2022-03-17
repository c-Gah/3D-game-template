import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { ExtendedObject3D } = AmmoNodeJS;
import { loadAsset } from '../loader.js';
import { internalObjectServer } from '../../shared/props.js'
import { buildPlayer } from '../../shared/player.js';

export async function createPlayer(playerId: string, factory: any, physics: any): Promise<internalObjectServer> {
    const glbObject: any = await loadAsset("box_man")

    const box_man = glbObject.scene.children[0];

    const extendedObject3D = new ExtendedObject3D();
    extendedObject3D.add(box_man);

    const properties: internalObjectServer = {
        common: {
            id: playerId,
            asset: "box_man",
            x: 35,
            y: 45,
            z: 0,
            collisionFlags: 0,
            mass: 0,
            shape: "mesh"
        },
        client: {
            collisionFlags: 0
        }
    }

    properties.object = buildPlayer(extendedObject3D, properties.common, factory, physics);
    return properties;
}