import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { propsAll } from '../types';

export function init(extendedObject3D: any, factory: any, physics: any, props: propsAll, model: GLTF) {

    const subModel = model.scene.children[0]

    extendedObject3D.add(subModel)

    const x = props.x;
    const y = props.y;
    const z = props.z;
    const collisionFlags = props.collisionFlags;

    extendedObject3D.name = props.id
    // May be uneeded
    extendedObject3D.rotateY(Math.PI + 0.1); // a hack
    //extendedObject3D.add(object3D);
    extendedObject3D.rotation.set(0, Math.PI * 1.5, 0);
    extendedObject3D.position.set(x, y, z);

    /**
     * Add the player to the scene with a body
     */
    factory.add.existing(extendedObject3D)

    const physicsOptions = {
        shape: 'sphere',
        //shape: 'mesh',
        radius: 0.25,
        width: 0.5,
        offset: { y: -0.25 }
    }
    /*
    const physicsOptions = {
        addChildren: false,
        shape: 'hacd' // or any other shape you want
    }
    */

    physics.add.existing(extendedObject3D, physicsOptions);

    extendedObject3D.body.setFriction(0.8)
    extendedObject3D.body.setAngularFactor(0, 0, 0)
    extendedObject3D.body.setAngularVelocity(0, 0, 0)

    // https://docs.panda3d.org/1.10/python/programming/physics/bullet/ccd
    extendedObject3D.body.setCcdMotionThreshold(1e-7)
    extendedObject3D.body.setCcdSweptSphereRadius(0.25)
    extendedObject3D.body.setCollisionFlags(collisionFlags);

    return extendedObject3D;
}

export function movePlayerForward(object3d: any, theta: any): void {
    if (object3d && object3d.body) {
        const speed = 4

        const x = Math.sin(theta) * speed,
            y = object3d.body.velocity.y,
            z = Math.cos(theta) * speed

        object3d.body.setVelocity(x, y, z)
    }
}

export function jump(object3d: any) {
    if (object3d === undefined) return
    if (object3d.body === undefined) return

    object3d.body.applyForceY(6)
}