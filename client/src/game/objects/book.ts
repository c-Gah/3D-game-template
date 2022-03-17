import { Project, PhysicsLoader, Scene3D, ExtendedObject3D, THREE, JoyStick, ThirdPersonControls, PointerLock, PointerDrag } from 'enable3d';
import { setProps } from '../../../../server/src/shared/props'
import type { propsAll } from '../../../../server/src/shared/props'

export async function addBook(scene: Scene3D, props: propsAll): Promise<ExtendedObject3D> {
    const object = await scene.load.gltf('book')
    const sceneObj = object.scenes[0]

    const book = new ExtendedObject3D()

    setProps(book, props)

    book.add(sceneObj)
    scene.add.existing(book)

    // add animations
    // sadly only the flags animations works
    object.animations.forEach((anim, i) => {
        scene.animationMixers.create(book).clipAction(anim).play()
        /*
        book.mixer = this.animationMixers.create(book)
        // overwrite the action to be an array of actions
        book.action = []
        book.action[i] = book.mixer.clipAction(anim)
        book.action[i].play()
        */
    })

    book.traverse(child => {
        if (child.isMesh) {
            child.castShadow = child.receiveShadow = false
            child.material["metalness"] = 0
            child.material["roughness"] = 1

            if (/mesh/i.test(child.name)) {
                scene.physics.add.existing(child, {
                    shape: 'concave',
                    mass: 0,
                    collisionFlags: 1,
                    autoCenter: false
                })
                child.body.setAngularFactor(0, 0, 0)
                child.body.setLinearFactor(0, 0, 0)
            }
        }
    })

    return book;
}