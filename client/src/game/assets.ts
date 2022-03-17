import type { Project, PhysicsLoader, Scene3D, ExtendedObject3D, THREE, JoyStick, ThirdPersonControls, PointerLock, PointerDrag } from 'enable3d';

type assetsTypes = {
    book: any,
    box_man: any,
}
export let assets: assetsTypes = [] as any;

export async function loadAssets(scene: Scene3D) {

    /**
     * Medieval Fantasy Book by Pixel (https://sketchfab.com/stefan.lengyel1)
     * https://sketchfab.com/3d-models/medieval-fantasy-book-06d5a80a04fc4c5ab552759e9a97d91a
     * Attribution 4.0 International (CC BY 4.0)
     */
    assets.book = scene.load.preload('book', '/gameAssets/book.glb')

    /**
     * box_man.glb by Jan Bláha
     * https://github.com/swift502/Sketchbook
     * CC-0 license 2018
     */
    assets.box_man = scene.load.preload('man', '/gameAssets/box_man.glb')

    await Promise.all([assets.book, assets.box_man])
}