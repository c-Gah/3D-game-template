import { BufferSchema, Model, string16, uint8, int16, uint16, int64, float32, string8, } from '@geckos.io/typed-array-buffer-schema'
import type AmmoNodeJS from '@enable3d/ammo-on-nodejs';

//type readableSet = { modelId: string, readable: propsReadable }

type bufferSet = { modelId: string, bufferData: ArrayBuffer }

// Data type emited by socket.io. This is what is sent from the server to the client
type transferableObj = { modelId: string, data: ArrayBuffer }

// built models are generated using the props provided upon buffer build request
type builtModelsType = {
    [key: string]: any
}
var builtModels: builtModelsType = {};

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
}

// Client physics props are the extension of common props available only to the client
type physicsPropsClient = {
    //breakable?: boolean,
    breakable?: number,
}

// Below types are used interacting with the various forms of readable prop data. Props data is either in an internal form or a readable form
export type propsAll = physicsPropsCommon & physicsPropsClient;

// Used only internally on either the server or the client. This is never transfered between the 2
export type internalObjectServer = {
    object?: AmmoNodeJS.ExtendedObject3D,
    common: physicsPropsCommon,
    client?: physicsPropsClient,
    //modelId?: string,
    //readable?: propsReadable
}

// Used for keeping multple internal object props data
export type internalObjectsServer = {
    [key: string]: internalObjectServer
}

export type internalObjectClient = {
    object?: AmmoNodeJS.ExtendedObject3D,
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

// Currently always creates a model. fix to re use
function createModel(readableData: propsAll): string {
    // Schemas create models that are used to transfer data
    // If data is sent to the schema it MUST has a matching asset. The reverse is also true
    type schemaType = {
        [key: string]: any
    }
    let schema: schemaType = {};

    let modelId = "";

    const objKeys = Object.keys(readableData);
    const objVals = Object.values(readableData);

    // TODO instead of using the values here, use the modelId to create the schema
    for (var i = 0; i < objKeys.length; i++) {
        const key = objKeys[i]
        const val = objVals[i]

        if (typeof val === "string") {
            // Problem with below is that a lot of models will be made in relation to the amount of varying string size
            // schema[key] = { type: string8, length: val.length }
            schema[key] = string8;
            modelId += "string8:"
        } else if (typeof val === "number") {
            schema[key] = int16
            modelId += "int16:"
            //x: { type: int16, digits: 3 },
        }
    }
    //const builtSchema = BufferSchema.schema('builtSchema', schema)
    const builtSchema = BufferSchema.schema(modelId, schema)

    const model = new Model(builtSchema)
    // Keep track of out newly created model
    builtModels[modelId] = model;

    //return modelId;
    return modelId;
    //const bufferData = model.toBuffer(array)

    //return { id: modelId, data: bufferData };
}

// Builds a buffer using readable props data. In addition schemas and models used for the actual trasnfer of data
// are dynamically created here. This is a necessary step in order to be able to have loosly typed physics props.
// Otherwise all variables defined in a props object would have to be defined and a schema made 1 to 1 for each
// of those props. The caller of this fuction is given the model id for tracking and actual buffer data for transferring
/*
export function buildBuffer(objects: internalObjectsServer): bufferSet[] {
    //export function buildBuffer(objects: propsObjectsInternal, array: propsReadableServer[]): transferableObj[] {
    const bufferDataArray: bufferSet[] = Object.values(objects).map(function (obj) {

        if (obj.modelId === undefined) {
            console.log("Error gett object modelid");
            return [] as any
        }
        if (obj.readable === undefined) {
            console.log("Error gett object readable");
            return [] as any
        }

        const model: Model = builtModels[obj.modelId];
        const bufferData = model.toBuffer(obj.readable)

        console.log("for server buffer");
        console.log(bufferData);

        return { modelId: obj.modelId, bufferData: bufferData };
    })
    return bufferDataArray;
}
*/

// Used to convert our buffer back into a readable props object.
export function destructBuffer(obj: transferableObj[]): void {
    //export function destructBuffer(obj: transferableObj[]): propsReadableServer[] {
    /*
    const model = builtModels[obj.id]

    const returnData: propsReadableServer[] = model.fromBuffer(obj.data)

    return returnData
    */
}