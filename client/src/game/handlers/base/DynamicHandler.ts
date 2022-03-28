import type { propsAll } from '../../../../../server/src/shared/types'
import type { ExtendedObject3D } from 'enable3d';
import { BaseHandler } from './BaseHandler'
import { rotate } from '../../../../../server/src/shared/handlerHelpers/base/dynamicObject'
import { Vector3 } from 'three';

export class DynamicHandler extends BaseHandler {
    doServerUpdate: boolean

    constructor(object: ExtendedObject3D, props: propsAll, doServerUpdate = true) {
        super(object, props);
        this.doServerUpdate = doServerUpdate
    }

    update(delta: number, objectProps: propsAll) {
        super.update(delta, objectProps);
        if (this.doServerUpdate) {
            this.updateFromServer(delta, objectProps)
        }
    }

    updateFromServer(delta: number, objectProps: propsAll) {
        const object3d = this.object3d

        if (object3d.body === undefined) return

        object3d.body.setVelocity(0, 0, 0)
        object3d.body.setAngularVelocity(0, 0, 0)

        this.serverMoveObject(delta, objectProps)

        if (objectProps.rotationX !== undefined) {
            const rotationOffsetX = objectProps.rotationX - object3d.rotation.x
            //object.body.setAngularVelocityX(rotationOffsetX * delta)
        }
        if (objectProps.rotationY !== undefined) {
            rotate(object3d, objectProps.rotationY)
        }
        if (objectProps.rotationZ !== undefined) {
            const rotationOffsetZ = objectProps.rotationZ - object3d.rotation.z
            //object.body.setAngularVelocityZ(rotationOffsetZ * delta)
        }
    }

    serverMoveObject(delta: number, objectProps: propsAll, timeFactor = 1) {
        const object3d = this.object3d

        const vector3 = this.getClientServerPositionOffset(objectProps)

        object3d.body.setVelocity(0, 0, 0)

        const deltaTimeFactor = delta / timeFactor

        object3d.body.applyForceX(vector3.x * deltaTimeFactor)
        object3d.body.applyForceY(vector3.y * deltaTimeFactor)
        object3d.body.applyForceZ(vector3.z * deltaTimeFactor)
    }

    getClientServerPositionOffset(objectProps: propsAll): Vector3 {
        const object3d = this.object3d
        let vector3 = new Vector3()

        try {
            vector3.x = objectProps.x - object3d.position.x
            vector3.y = objectProps.y - object3d.position.y
            vector3.z = objectProps.z - object3d.position.z
        } catch (e) {
            console.log("Position Offset Error: " + e);
        }

        return vector3
    }
}