import type AmmoNodeJS from '@enable3d/ammo-on-nodejs';
import type { ExtendedObject3D } from 'enable3d';

// Common physics props is object data that is synced between the user and client
type physicsPropsCommon = {
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
    angularVelocityX?: number,
    angularVelocityY?: number,
    angularVelocityZ?: number,
}

// Client physics props are the extension of common props available only to the client
type physicsPropsClient = {
    //breakable?: boolean,
    breakable?: number,
    collisionFlags?: number,
}

type positionType = {
    x: number,
    y: number,
    z: number
}

export type clientStateType = {
    movement?: positionType,
    angularVelocity?: positionType
    doJump?: boolean
}

type timedActionType = {
    startTime: number,
    currentTime: number,
    duration: number,
}

export type clientServerStateType = {
    doJump: timedActionType
}

// Below types are used interacting with the various forms of readable prop data. Props data is either in an internal form or a readable form
export type propsAll = physicsPropsCommon & physicsPropsClient;

// Used only internally on either the server or the client. This is never transfered between the 2
export type internalObjectServer = {
    object?: AmmoNodeJS.ExtendedObject3D,
    common: physicsPropsCommon,
    client?: physicsPropsClient,
    clientState?: clientStateType,
    clientServerState?: clientServerStateType,

    // models not currently used
    modelId?: string,
    readable?: any
}

// Used for keeping multple internal object props data
export type internalObjectsServer = {
    [key: string]: internalObjectServer
}

export type internalObjectClient = {
    object?: ExtendedObject3D,
    props?: propsAll,
    //modelId?: string,
    //readable?: propsReadable
}

export type internalObjectsClient = {
    [key: string]: internalObjectClient
}


// TODO implement updating props data from internal object before creating a readable props object
function updatePropsData() {

}

// TODO create a function to convert readable data to an internal version
function toInternal() {

}

// Add more update logic here later
export function updateAllProps(objects: internalObjectsServer): void {
    Object.values(objects).map(function (obj) {
        if (obj.object === undefined) return

        obj.common.x = obj.object.position.x
        obj.common.y = obj.object.position.y
        obj.common.z = obj.object.position.z

        if(obj.object.body && obj.object.body.angularVelocity) {
            obj.common.angularVelocityX = obj.object.body.angularVelocity.x
            obj.common.angularVelocityY = obj.object.body.angularVelocity.y
            obj.common.angularVelocityZ = obj.object.body.angularVelocity.z
        }
        
        if (obj.object.body === undefined) return

        obj.common.collisionFlags = obj.object.body.getCollisionFlags()
    });
}

// Converts internal props storage to an readable data type. This will still need to transformed into a buffer before sent
//TODO add updating of props from object
function getAllProps(obj: internalObjectServer): propsAll {

    // Needs manual creation. Any way to improve this?
    //let base: object3DPropsBase = { ...obj }
    let common: physicsPropsCommon = { ...obj }.common
    let client: physicsPropsClient = { ...obj }.client ?? {}

    let combined: propsAll = { ...common, ...client }
    return combined;
}

// Converts internal object of internal props to a readable array of props
//export function buildReadableArray(object3D: propsObjectsInternal, isServer = true): propsReadable[] {
export function getAllPropsArray(object3D: internalObjectsServer): propsAll[] {
    //var readableSet = Object.values(object3D).map(function (obj) {
    var readableArray = Object.values(object3D).map(function (obj) {
        let readable: propsAll = getAllProps(obj);
        return readable;
    });

    return readableArray;
}

// TODO make this a full feldged automated proccess depending on the props sent over
export function setProps(object: any, props: propsAll) {

    object.name = props.id
    // nullish coalescing operator
    object.position.x = props.x ?? 0;
    object.position.y = props.y ?? 0;
    object.position.z = props.z ?? 0;

    object.collisionFlags = props.collisionFlags;

    object.mass = props.mass;

    return object
}