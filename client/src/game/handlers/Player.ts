import type { Scene3D } from 'enable3d';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type { propsAll } from '../../../../server/src/shared/types';
import { DynamicHandler } from './base/DynamicHandler'
import { init, jump } from '../../../../server/src/shared/handlerHelpers/player'
import { ExtendedObject3D } from 'enable3d';


export class Player extends DynamicHandler {
    constructor(scene: Scene3D, props: propsAll, model: GLTF, doServerUpdate = true) {
        super(new ExtendedObject3D(), props, doServerUpdate);

        var object3d = this.object3d;

        init(object3d, scene.physics.factory, scene.physics, props, model);

        // add shadow
        object3d.traverse(child => {
            if (child.isMesh) {
                child.castShadow = child.receiveShadow = false
                // https://discourse.threejs.org/t/cant-export-material-from-blender-gltf/12258
                child.material["roughness"] = 1
                child.material["metalness"] = 0
            }
        })
        /**
         * Animations
         */
        scene.animationMixers.add(object3d.anims.mixer)
        model.animations.forEach(animation => {
            if (animation.name) {
                object3d.anims.add(animation.name, animation)
            }
        })
        object3d.anims.play('idle')
    }

    update(delta: number, objectProps: propsAll) {
        super.update(delta, objectProps)

        if (this.doServerUpdate) {
            this.run(objectProps)
            if (objectProps.doJump === 1) {
                this.jump()
            }
        }
    }

    run(objectProps: propsAll) {
        const object3d = this.object3d

        if (objectProps.isMoving === 1) {
            if (object3d.anims.current === 'idle') {
                object3d.anims.play('run')
            }
        } else {
            if (object3d.anims.current === 'run') {
                object3d.anims.play('idle')
            }
        }
    }

    jump() {
        const object3d = this.object3d

        object3d.anims.play('jump_running', 500, false)

        setTimeout(() => {
            object3d.anims.play('idle')
        }, 1000)

        jump(this)
    }
}

export async function buildPlayerObject(scene: Scene3D, physicsProps: propsAll): Promise<Player> {
    const object: GLTF = await scene.load.gltf('man')

    const player = new Player(scene, physicsProps, object)

    return player;
}