
import type { Project, PhysicsLoader, Scene3D, ExtendedObject3D, THREE, JoyStick, ThirdPersonControls, PointerLock, PointerDrag } from 'enable3d';


export function addBox(scene: Scene3D): ExtendedObject3D {
    return scene.physics.add.box({ y: 10, x: 35 }, { lambert: { color: 'red' } })
}

export function addBox2(scene: Scene3D, physicsProps: any): ExtendedObject3D {
    return scene.physics.add.box(physicsProps, { lambert: { color: 'green' } })
}