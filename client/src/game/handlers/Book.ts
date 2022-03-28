import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type { propsAll } from '../../../../server/src/shared/types'
import type { Scene3D } from 'enable3d';
import { ExtendedObject3D } from 'enable3d';
import { BaseHandler } from './base/BaseHandler'
import { init } from '../../../../server/src/shared/handlerHelpers/book'


export class Book extends BaseHandler {
    constructor(object: ExtendedObject3D, scene: Scene3D, props: propsAll, model: GLTF) {
        super(object, props)

        const object3d = this.object3d

        init(object3d, scene.physics, scene, model)

        // add animations
        // sadly only the flags animations works
        model.animations.forEach((anim, i) => {
            scene.animationMixers.create(object3d).clipAction(anim).play()
        })

        object3d.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = child.receiveShadow = false
                child.material["metalness"] = 0
                child.material["roughness"] = 1
            }
        })
    }
}


export async function createBook(scene: Scene3D, props: propsAll): Promise<Book> {
    const model = await scene.load.gltf('book')

    const extendedObject3D = new ExtendedObject3D()
    const book = new Book(extendedObject3D, scene, props, model)

    return book
}