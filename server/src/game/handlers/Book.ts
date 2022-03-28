import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
import { loadAsset } from '../loader.js';
import { BaseHandler } from './base/BaseHandler.js'
import { init } from '../../shared/handlerHelpers/book.js'
import { physicsPropsCommon, physicsPropsClient } from '../../shared/types.js'

export class Book extends BaseHandler {
    constructor(physics: AmmoNodeJS.Physics, model: any, propsCommon: physicsPropsCommon, propsClient: physicsPropsClient = {}) {
        super(new AmmoNodeJS.ExtendedObject3D(), propsCommon, propsClient);

        const book = this.object3d

        init(book, physics, physics.factory, model)
    }
}

export async function createBook(physics: AmmoNodeJS.Physics): Promise<Book> {
    const glbObject = await loadAsset("book")

    const props: physicsPropsCommon = {
        id: "book",
        asset: "book",
        x: 10,
        y: 0,
        z: 0,
        collisionFlags: 0
    }

    let book = new Book(physics, glbObject, props)

    return book;
}