import type { propsAll } from '../../../../../server/src/shared/types'
import type { ExtendedObject3D } from 'enable3d';
import { init } from '../../../../../server/src/shared/handlerHelpers/base/gameObject'
//import type { propsAll } from '../../types'

/** Set the collision flags. 0 is DYNAMIC, 1 is STATIC, 2 is KINEMATIC, 4 GHOST */
export class BaseHandler {
    object3d: ExtendedObject3D
    props: propsAll
    #deletionTimeout: any
    doDestroy = false

    constructor(object: ExtendedObject3D, props: propsAll) {
        init(object, props)

        this.object3d = object
        this.props = props
    }

    update(delta: number, objectProps: propsAll) {
        // console.log("Game Update");

        clearTimeout(this.#deletionTimeout);
        this.#deletionTimeout = setTimeout(() => {
            console.log("Delete unused object")

            this.doDestroy = true
        }, 1000)
    }
}