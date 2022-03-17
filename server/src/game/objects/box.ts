
import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
import { internalObjectServer } from '../../shared/props.js'

export function createBox(physics: AmmoNodeJS.Physics, props: internalObjectServer): internalObjectServer {
    props.object = physics.add.box(props.common);
    return props
}


export function createGround(physics: AmmoNodeJS.Physics): internalObjectServer {
    const props: internalObjectServer = {
        common: {
            id: "ground",
            asset: "ground",
            x: 35,
            y: 5,
            z: 0,
            width: 40,
            depth: 5,
            collisionFlags: 2,
            mass: 0,
        }
    }

    props.object = physics.add.box(props.common);
    return props
}