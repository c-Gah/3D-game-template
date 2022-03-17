import type { internalObjectServer } from '../shared/props.js'
import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { Loaders } = AmmoNodeJS;
import path from 'path';
import { objects } from './updates.js'
import { createBook } from './objects/book.js';
import { createBox, createGround } from './objects/box.js';

export async function loadAsset(type: string): Promise<any> {
    console.log("Load Specific Asset")

    const __dirname = path.resolve();
    const GLTFLoader = new Loaders.GLTFLoader();

    let object: any;
    if (type === "book") {
        object = await GLTFLoader.load(path.join(__dirname, "src/assets/book.glb"));
    } else {
        object = await GLTFLoader.load(path.join(__dirname, "src/assets/box_man.glb"));
    }

    return object
}

export async function loadMap(factory: any, physics: AmmoNodeJS.Physics) {
    // remove class values to functional componants
    // order matters for some reason

    //objects[properties.id] = properties;

    //const boxManProps = await createPlayer("suzanne", factory, physics);
    //objects[boxManProps.common.id] = boxManProps

    const book = await createBook(factory, physics);
    objects[book.common.id] = book

    const groundProps = createGround(physics);
    objects[groundProps.common.id] = groundProps

    const boxProps: internalObjectServer = {
        common: {
            id: "box",
            asset: "box",
            x: 35,
            y: 20,
            z: 0,
            width: 5,
            depth: 5,
            collisionFlags: 0,
            mass: 10,
        },
        client: {
            //breakable: true
            breakable: 1
        }
    }
    createBox(physics, boxProps);
    objects[boxProps.common.id] = boxProps

    //const boxProps2 = createBox(physics);
    //objects[boxProps2.id] = boxProps2

    // TODO create multiple models for creating boxs and box men
}