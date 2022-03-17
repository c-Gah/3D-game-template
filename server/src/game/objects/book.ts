import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { ExtendedObject3D } = AmmoNodeJS;
import { loadAsset } from '../loader.js';
import { setProps, internalObjectServer } from '../../shared/props.js'


// DOuble check if factory is needed here
export async function createBook(factory: any, physics: AmmoNodeJS.Physics): Promise<internalObjectServer> {
    const glbObject: any = await loadAsset("book")

    const scene = glbObject.scenes[0]

    let book = new ExtendedObject3D()
    book.add(scene)

    const properties: internalObjectServer = {
        common: {
            id: "book",
            asset: "book",
            x: 0,
            y: 0,
            z: 0,
            collisionFlags: 0
        }
    }

    //book = setProps(book, properties.common)
    setProps(book, properties.common)

    physics.factory.add.existing(book)

    book.traverse(child => {
        if (child.isMesh) {

            let regex = /mesh/i;

            if (regex.test(child.name)) {
                physics.add.existing(child, {
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

    properties.object = book;
    return properties;
}