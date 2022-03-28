
import type { Scene3D } from 'enable3d';
import type { propsAll } from '../../../../server/src/shared/types'
import { DynamicHandler } from './base/DynamicHandler'
import { init } from '../../../../server/src/shared/handlerHelpers/box'
import { ExtendedObject3D } from 'enable3d';

let deletes = 100

export class Box extends DynamicHandler {
    constructor(scene: Scene3D, props: propsAll) {
        super(init(scene.physics, props), props)

        //this.object3d = 
        
        //const box = scene.physics.add.box(props, { lambert: { color: 'green' } })
    }

    update(delta: number, objectProps: propsAll): void {
        super.update(delta, objectProps)

        const object3d = this.object3d

        //console.log("fdsfdfsf")
        //console.log(this.object3d.rotation)
        //console.log(objectProps.ro)

        deletes += delta
        if (deletes > 500) {
            deletes = 0
            //console.log(object3d.position);
        }
    }
}