import { propsAll } from './props'

export function buildPlayer(extendedObject3D: any, properties: propsAll, factory: any, physics: any) {
    const x = properties.x;
    const y = properties.y;
    const z = properties.z;
    const collisionFlags = properties.collisionFlags;

    //let man = object3D;
    //let superMan = new ExtendedObject3D()

    //let extendedObject3D = new ExtendedObject3D()
    extendedObject3D.name = properties.id
    // May be uneeded
    extendedObject3D.rotateY(Math.PI + 0.1); // a hack
    //extendedObject3D.add(object3D);
    extendedObject3D.rotation.set(0, Math.PI * 1.5, 0);
    extendedObject3D.position.set(x, y, z);
    //extendedObject3D.position.set(35, 50.5, 0);

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

