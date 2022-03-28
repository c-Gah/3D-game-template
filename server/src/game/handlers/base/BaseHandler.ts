import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { ExtendedObject3D } = AmmoNodeJS;
import type { propsAll } from '../../../shared/types.js'
import { init } from '../../../shared/handlerHelpers/base/gameObject.js'
import { physicsPropsCommon, physicsPropsClient, clientStateType } from '../../../shared/types.js'

type timedActionType = {
    startTime: number,
    currentTime: number,
    duration: number,
}

type clientServerStateType = {
    doJump: timedActionType
}

/** Set the collision flags. 0 is DYNAMIC, 1 is STATIC, 2 is KINEMATIC, 4 GHOST */
export class BaseHandler {
    object3d: AmmoNodeJS.ExtendedObject3D
    common: physicsPropsCommon
    client?: physicsPropsClient
    clientState: clientStateType
    clientServerState: clientServerStateType

    // models not currently used
    // modelId?: string,
    // readable?: any

    constructor(object3d: AmmoNodeJS.ExtendedObject3D, propsCommon: physicsPropsCommon, propsClient: physicsPropsClient = {}) {
        init(object3d, propsCommon)

        this.object3d = object3d
        this.common = propsCommon
        this.client = propsClient
        this.clientState = {}

        this.clientServerState = this.createClientServerStateType()

    }

    createClientServerStateType(): clientServerStateType {
        var newDoJump = {
            startTime: 0,
            currentTime: 0,
            duration: 1,
        }

        var newClientServerState: clientServerStateType = { doJump: newDoJump }

        return newClientServerState
    }

    update(delta: number) {
        this.updateAllProps()
    }

    // Add more update logic here later
    updateAllProps(): void {
        const object = this.object3d

        this.common.x = object.position.x
        this.common.y = object.position.y
        this.common.z = object.position.z

        if (object.body) {

            this.common.collisionFlags = object.body.getCollisionFlags()

            if (object.rotation) {

                // TODO
                //console.log(this.body.rotation.x)
                //this.common.rotationX = this.body.rotation.x
                //this.common.rotationY = this.body.rotation.y
                //this.common.rotationZ = this.body.rotation.z

                this.common.rotationX = this.clientState?.rotation?.x ?? 0
                this.common.rotationY = this.clientState?.rotation?.y ?? 0
                this.common.rotationZ = this.clientState?.rotation?.z ?? 0
            }
        }
        this.common.isMoving = this.clientState?.movement?.isMoving ? 1 : 0 ?? 0
        this.common.doJump = this.clientState?.doJump ? 1 : 0 ?? 0
    }


    // Converts internal props storage to an readable data type. This will still need to transformed into a buffer before sent
    getAllProps(): propsAll {
        const object = this

        let common: physicsPropsCommon = { ...object }.common
        let client: physicsPropsClient = { ...object }.client ?? {}

        let combined: propsAll = { ...common, ...client }
        return combined;
    }
}
