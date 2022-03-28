import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
import { BaseHandler } from './BaseHandler.js'
import { physicsPropsCommon, physicsPropsClient } from '../../../shared/types.js'
import { rotate } from '../../../shared/handlerHelpers/base/dynamicObject.js'

export class DynamicHandler extends BaseHandler {
    constructor(object3d: AmmoNodeJS.ExtendedObject3D, propsCommon: physicsPropsCommon, propsClient: physicsPropsClient = {}) {
        super(object3d, propsCommon, propsClient);
    }

    update(delta: number) {
        super.update(delta);

        const object = this.object3d

        if (this.clientState.rotation === undefined) return
        
        rotate(object, this.clientState.rotation.y)
    }
}