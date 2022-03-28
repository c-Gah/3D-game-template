import { propsAll } from "../../types";

export function init(object: any, props: propsAll) {

    object.name = props.id
    // nullish coalescing operator
    object.position.x = props.x ?? 0;
    object.position.y = props.y ?? 0;
    object.position.z = props.z ?? 0;

    //object.body.collisionFlags = props.collisionFlags;
    /*
    object.body.setCollisionFlags(props.collisionFlags);
    //object.body.collisionFlags = props.collisionFlags;

    //object.mass = props.mass;
    //object.body.ammo..mass = props.mass;

    return object
    */
}