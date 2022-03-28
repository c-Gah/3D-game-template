import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { Loaders } = AmmoNodeJS;
import path from 'path';
import { objects } from './updates.js'
import { createBook } from './handlers/Book.js';
import { createBox, createGround } from './handlers/Box.js';

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

export async function loadMap(physics: AmmoNodeJS.Physics) {
    //const player = await createPlayer("suzanne", physics);
    //objects[player.common.id] = player

    const book = await createBook(physics);
    objects[book.common.id] = book

    //const groundProps = createGround(physics);
    //objects[groundProps.common.id] = groundProps

    const box = createBox(physics);
    objects[box.common.id] = box
}