import type { ExtendedObject3D } from 'enable3d';

// Common physics props is object data that is synced between the user and client
export type physicsPropsCommon = {
    // The 2 //3 below are not physics related, however are needed for 3D object creation by the client/ server
    // They are added to the state and send to the server
    // Object identifier. Also used for Snapshot Interpolation
    id: string,
    // Used for asset loading
    asset: string,
    //shape?: string | undefined,

    depth?: number,
    widthSegments?: number,
    heightSegments?: number,
    depthSegments?: number,
    width?: number,
    height?: number,
    x?: number,
    y?: number,
    z?: number,
    name?: string,
    collisionFlags?: number,
    collisionGroup?: number,
    collisionMask?: number,
    fractureImpulse?: number,
    mass?: number,
    shape?: string,
    rotationX?: number,
    rotationY?: number,
    rotationZ?: number,
    isMoving?: number,
    doJump?: number
}

// Client physics props are the extension of common props available only to the client
export type physicsPropsClient = {
    //breakable?: boolean,
    breakable?: number,
    collisionFlags?: number,
}

type positionType = {
    x: number,
    y: number,
    z: number
}

type movementType = {
    isMoving: boolean,
    theta: number,
}

export type clientStateType = {
    movement?: movementType,
    rotation?: positionType
    doJump?: boolean
}

// Below types are used interacting with the various forms of readable prop data. Props data is either in an internal form or a readable form
export type propsAll = physicsPropsCommon & physicsPropsClient;

export type internalObjectClient = {
    object?: ExtendedObject3D,
    props?: propsAll,
    //modelId?: string,
    //readable?: propsReadable
}

export type internalObjectsClient = {
    [key: string]: internalObjectClient
}