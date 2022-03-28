
import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
import { DynamicHandler } from './base/DynamicHandler.js'
import { init } from '../../shared/handlerHelpers/box.js'
import { physicsPropsCommon, physicsPropsClient } from '../../shared/types.js'

let deletes = 100

export class Box extends DynamicHandler {

    constructor(physics: AmmoNodeJS.Physics, propsCommon: physicsPropsCommon, propsClient: physicsPropsClient = {}) {
        super(init(physics, propsCommon), propsCommon, propsClient);
        
    }

    update(delta: number): void {
        super.update(delta);

        const object = this.object3d

        deletes += delta
        if (deletes > .5) {
            deletes = 0
            // console.log(object.position);
        }

    }
}

export function createBox(physics: AmmoNodeJS.Physics): Box {
    const propsCommon: physicsPropsCommon = {
        id: "box",
        asset: "box",
        x: 20,
        y: 60,
        z: 0,
        width: 5,
        depth: 5,
        collisionFlags: 0,
        mass: 10,
    }
    const propsClient: physicsPropsClient = {
        //breakable: true
        breakable: 0
    }

    const box = new Box(physics, propsCommon, propsClient);

    return box
}

export function createGround(physics: AmmoNodeJS.Physics): Box {

    const props: physicsPropsCommon = {
        id: "ground",
        asset: "ground",
        x: 35,
        y: 5,
        z: 0,
        width: 10,
        depth: 2,
        height: 2,
        collisionFlags: 2,
        mass: 0,
    }

    const box = new Box(physics, props);

    return box
}