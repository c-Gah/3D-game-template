import { Project, PhysicsLoader, Scene3D, ExtendedObject3D, THREE, JoyStick, ThirdPersonControls, PointerLock, PointerDrag } from 'enable3d';
import { buildPlayer } from '../../../../server/src/shared/player'

export async function addPlayer(scene: Scene3D, physicsProps: any): Promise<ExtendedObject3D> {

    const object = await scene.load.gltf('man')
    const man = object.scene.children[0]

    var extendedObject3D = new ExtendedObject3D()
    extendedObject3D.add(man)

    extendedObject3D = buildPlayer(extendedObject3D, physicsProps, scene, scene.physics)

    // add shadow
    extendedObject3D.traverse(child => {
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
    scene.animationMixers.add(extendedObject3D.anims.mixer)
    object.animations.forEach(animation => {
        if (animation.name) {
            extendedObject3D.anims.add(animation.name, animation)
        }
    })
    extendedObject3D.anims.play('idle')

    return extendedObject3D;
}

export async function addPlayer2(scene: Scene3D): Promise<ExtendedObject3D> {

    const object = await scene.load.gltf('man')
    const man = object.scene.children[0]

    var extendedObject3D = new ExtendedObject3D()

    extendedObject3D.name = 'man'
    extendedObject3D.rotateY(Math.PI + 0.1) // a hack
    extendedObject3D.add(man)
    extendedObject3D.rotation.set(0, Math.PI * 1.5, 0)
    extendedObject3D.position.set(35, 40, 0)
    // add shadow
    extendedObject3D.traverse(child => {
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
    scene.animationMixers.add(extendedObject3D.anims.mixer)
    object.animations.forEach(animation => {
        if (animation.name) {
            extendedObject3D.anims.add(animation.name, animation)
        }
    })
    extendedObject3D.anims.play('idle')

    /**
     * Add the player to the scene with a body
     */
    scene.add.existing(extendedObject3D)
    scene.physics.add.existing(extendedObject3D, {
        shape: 'sphere',
        radius: 0.25,
        width: 0.5,
        offset: { y: -0.25 }
    })
    extendedObject3D.body.setFriction(0.8)
    extendedObject3D.body.setAngularFactor(0, 0, 0)

    // https://docs.panda3d.org/1.10/python/programming/physics/bullet/ccd
    extendedObject3D.body.setCcdMotionThreshold(1e-7)
    extendedObject3D.body.setCcdSweptSphereRadius(0.25)

    return extendedObject3D;
}