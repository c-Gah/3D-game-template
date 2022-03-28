import { Vector3 } from 'three';

export function rotate(object: any, theta: number) {

    if (object && object.body) {

        const speed = 4
        const v3 = new Vector3()

        const rotationMan = object.getWorldDirection(v3)
        const thetaMan = Math.atan2(rotationMan.x, rotationMan.z)
        object.body.setAngularVelocityY(0)

        const l = Math.abs(theta - thetaMan)
        //let rotationSpeed = isTouchDevice ? 2 : 4
        let rotationSpeed = 2
        let d = Math.PI / 24

        if (l > d) {
            if (l > Math.PI - d) rotationSpeed *= -1
            if (theta < thetaMan) rotationSpeed *= -1
            object.body.setAngularVelocityY(rotationSpeed)
        }
    }
}