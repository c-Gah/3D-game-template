import { Project, PhysicsLoader, Scene3D, ExtendedObject3D, THREE, JoyStick, ThirdPersonControls, PointerLock, PointerDrag } from 'enable3d';
import { sendMovement, sendAngularVelocity, sendJump } from '../coms'
//var superMan;
var keys;
var moveTop = 0
var moveRight = 0
var move = false
var canJump = true;
var controls;

/**
 * Is touch device?
 */
const isTouchDevice = 'ontouchstart' in window


function setKeys() {
    /**
     * Add Keys
     */
    keys = {
        w: { isDown: false },
        a: { isDown: false },
        s: { isDown: false },
        d: { isDown: false },
        space: { isDown: false }
    }

    const press = (e, isDown) => {
        e.preventDefault()
        const { keyCode } = e
        switch (keyCode) {
            case 87: // w
                keys.w.isDown = isDown
                break
            case 38: // arrow up
                keys.w.isDown = isDown
                break
            case 32: // space
                keys.space.isDown = isDown
                break
        }
    }

    document.addEventListener('keydown', e => press(e, true))
    document.addEventListener('keyup', e => press(e, false))
}

function setJoystick(object: ExtendedObject3D) {
    /**
     * Add joystick
     */
    if (isTouchDevice) {
        const joystick = new JoyStick()
        const axis = joystick.add.axis({
            styles: { left: 35, bottom: 35, size: 100 }
        })
        axis.onMove(event => {
            /**
             * Update Camera
             */
            //const { top, right } = event
            moveTop = event["top"] * 3
            moveRight = event["right"] * 3
        })
        const buttonA = joystick.add.button({
            letter: 'A',
            styles: { right: 35, bottom: 110, size: 80 }
        })
        buttonA.onClick(() => jump(object))
        const buttonB = joystick.add.button({
            letter: 'B',
            styles: { right: 110, bottom: 35, size: 80 }
        })
        buttonB.onClick(() => (move = true))
        buttonB.onRelease(() => (move = false))
    }
}

function setCamera(scene: Scene3D, obj: ExtendedObject3D) {
    /**
     * Add 3rd Person Controls
     */
    controls = new ThirdPersonControls(scene.camera, obj, {
        offset: new THREE.Vector3(0, 1, 0),
        targetRadius: 3
    })
    // set initial view to 90 deg theta
    controls.theta = 90

    /**
     * Add Pointer Lock and Pointer Drag
     */
    if (!isTouchDevice) {
        let pl = new PointerLock(scene.canvas)
        let pd = new PointerDrag(scene.canvas)
        pd.onMove(delta => {
            if (pl.isLocked()) {
                controls.update(delta.x * 2, delta.y * 2)
            }
        })
    }
}

export function makePlayable(scene: Scene3D, obj: ExtendedObject3D) {
    setKeys();
    setJoystick(obj);
    setCamera(scene, obj);
}

export function updatePlayerChar(time, delta: number, scene: Scene3D, superMan: ExtendedObject3D) {
    if (superMan && superMan.body) {
        //console.log(superMan.body.position.y);

        /**
         * Update Controls
         */
        controls.update(moveRight * 2, -moveTop * 2)
        /**
         * Player Turn
         */
        const speed = 4
        const v3 = new THREE.Vector3()

        const rotation = scene.camera.getWorldDirection(v3)
        const theta = Math.atan2(rotation.x, rotation.z)
        const rotationMan = superMan.getWorldDirection(v3)
        const thetaMan = Math.atan2(rotationMan.x, rotationMan.z)
        superMan.body.setAngularVelocityY(0)

        const l = Math.abs(theta - thetaMan)
        let rotationSpeed = isTouchDevice ? 2 : 4
        let d = Math.PI / 24

        if (l > d) {
            if (l > Math.PI - d) rotationSpeed *= -1
            if (theta < thetaMan) rotationSpeed *= -1
            superMan.body.setAngularVelocityY(rotationSpeed)
            sendAngularVelocity(0, rotationSpeed, 0)
        }

        /**
         * Player Move
         */
        if (keys.w.isDown || move) {
            if (superMan.animation.current === 'idle' && canJump) superMan.animation.play('run')

            const x = Math.sin(theta) * speed,
                y = superMan.body.velocity.y,
                z = Math.cos(theta) * speed

            //superMan.body.setVelocity(x, y, z)
            sendMovement(x, y, z)

        } else {
            if (superMan.animation.current === 'run' && canJump) superMan.animation.play('idle')
            sendMovement(0, 0, 0)
        }

        /**
         * Player Jump
         */
        if (keys.space.isDown && canJump) {
            jump(superMan)
        }
    }
}

function jump(superMan: ExtendedObject3D) {
    if (!superMan || !canJump) return
    //canJump = false
    superMan.animation.play('jump_running', 500, false)
    
    setTimeout(() => {
        canJump = true
        superMan.animation.play('idle')
    }, 1000)
    
    superMan.body.applyForceY(6)
    sendJump(true)
}