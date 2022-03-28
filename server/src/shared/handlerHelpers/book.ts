import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export function init(book: any, physics: any, factory: any, model: GLTF) {
    const subModel = model.scenes[0]

    book.add(subModel)
    factory.add.existing(book)

    book.traverse((child: any) => {
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
}