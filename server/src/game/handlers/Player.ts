import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { ExtendedObject3D } = AmmoNodeJS;
import { loadAsset } from '../loader.js';
import { DynamicHandler } from './base/DynamicHandler.js'
import { init } from '../../shared/handlerHelpers/player.js'
import { physicsPropsCommon, physicsPropsClient } from '../../shared/types.js'
import { movePlayerForward, jump } from '../../shared/handlerHelpers/player.js'


export class Player extends DynamicHandler {
    constructor(physics: AmmoNodeJS.Physics, glbObject: any, propsCommon: physicsPropsCommon, propsClient: physicsPropsClient = {}) {
        super(new ExtendedObject3D(), propsCommon, propsClient);

        const player = this.object3d

        init(player, physics.factory, physics, propsCommon, glbObject)
    }


    update(delta: number) {
        super.update(delta);

        // console.log(this.body.velocity);

        this.movePlayer()

        this.updateJumpCooldown(delta)
        this.jumpPlayer()
    }

    movePlayer() {
        const object = this.object3d

        //console.log(this.clientState)
        if (this.clientState === undefined) return
        if (this.clientState.movement === undefined) return

        const data = this.clientState.movement

        try {
            if (data.isMoving) {
                movePlayerForward(object, data.theta)
            }
            /*
            if (objects[worldObjectID] === undefined) return
            if (objects[worldObjectID].object === undefined) return
    
            objects[worldObjectID].object?.body.setVelocityX(data.x)
            //objects[worldObjectID].object?.body.setVelocityY(data.y)
            objects[worldObjectID].object?.body.setVelocityZ(data.z)
            //console.log("player movement 111: " + data.x);
            //console.log("player movement: " + objects[worldObjectID].object?.body.position.x);
            //console.log("player movement: " + objects[worldObjectID].object?.body.velocity.x);
            */
        } catch (e) {
            console.log("Move Player Error: " + e)
        }
    }

    jumpPlayer() {
        const object = this

        if (object.clientState.doJump === undefined) return

        if (object.clientState.doJump && object.clientServerState.doJump.startTime === 0) {
            object.clientServerState.doJump.startTime = object.clientServerState.doJump.duration;
            jump(object.object3d)
        }
    }

    updateJumpCooldown(delta: number) {
        const object = this

        if (object.clientServerState.doJump.startTime > 0) {
            object.clientServerState.doJump.startTime -= delta


            if (object.clientServerState.doJump.startTime < 0) {
                object.clientServerState.doJump.startTime = 0
            }
        }
    }
}

export async function createPlayer(playerId: string, physics: any): Promise<Player> {
    const glbObject: any = await loadAsset("box_man")

    const propsCommon: physicsPropsCommon = {
        id: playerId,
        asset: "box_man",
        x: 35,
        y: (10 + Math.random() * 5),
        z: 0,
        collisionFlags: 0,
        mass: 0,
        shape: "mesh"
    }
    const propsClient: physicsPropsClient = {
        collisionFlags: 0
    }

    const player = new Player(physics, glbObject, propsCommon, propsClient);

    return player;
}