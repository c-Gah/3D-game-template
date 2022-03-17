import { Project, PhysicsLoader, Scene3D, ExtendedObject3D, THREE, JoyStick, ThirdPersonControls, PointerLock, PointerDrag } from 'enable3d';

var superMan;
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

function setJoystick() {
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
        buttonA.onClick(() => jump())
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

function setInputs(scene: Scene3D, obj: ExtendedObject3D) {
    setKeys();
    setJoystick();
    setCamera(scene, obj);
}

export async function addMan(scene: Scene3D) {

    const object = await scene.load.gltf('man')
    const man = object.scene.children[0]

    var extendedObject3D = new ExtendedObject3D()

    extendedObject3D.name = 'man'
    extendedObject3D.rotateY(Math.PI + 0.1) // a hack
    extendedObject3D.add(man)
    extendedObject3D.rotation.set(0, Math.PI * 1.5, 0)
    extendedObject3D.position.set(35, 40, 0)
    // add shadow
    extendedObject3D.traverse(child => {
        if (child.isMesh) {
            child.castShadow = child.receiveShadow = false
            // https://discourse.threejs.org/t/cant-export-material-from-blender-gltf/12258
            child.material["roughness"] = 1
            child.material["metalness"] = 0
        }
    })

    /**
     * Animations
     */
    scene.animationMixers.add(extendedObject3D.anims.mixer)
    object.animations.forEach(animation => {
        if (animation.name) {
            extendedObject3D.anims.add(animation.name, animation)
        }
    })
    extendedObject3D.anims.play('idle')

    /**
     * Add the player to the scene with a body
     */
    scene.add.existing(extendedObject3D)
    scene.physics.add.existing(extendedObject3D, {
        shape: 'sphere',
        radius: 0.25,
        width: 0.5,
        offset: { y: -0.25 }
    })
    extendedObject3D.body.setFriction(0.8)
    extendedObject3D.body.setAngularFactor(0, 0, 0)

    // https://docs.panda3d.org/1.10/python/programming/physics/bullet/ccd
    extendedObject3D.body.setCcdMotionThreshold(1e-7)
    extendedObject3D.body.setCcdSweptSphereRadius(0.25)


    setInputs(scene, extendedObject3D)
    superMan = extendedObject3D;
}

export function updatePlayerChar(scene: Scene3D) {
    if (superMan && superMan.body) {

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
        }

        /**
         * Player Move
         */
        if (keys.w.isDown || move) {
            if (superMan.animation.current === 'idle' && canJump) superMan.animation.play('run')

            const x = Math.sin(theta) * speed,
                y = superMan.body.velocity.y,
                z = Math.cos(theta) * speed

            superMan.body.setVelocity(x, y, z)
        } else {
            if (superMan.animation.current === 'run' && canJump) superMan.animation.play('idle')
        }

        /**
         * Player Jump
         */
        if (keys.space.isDown && canJump) {
            jump()
        }
    }
}

function jump() {
    if (!superMan || !canJump) return
    canJump = false
    superMan.animation.play('jump_running', 500, false)
    setTimeout(() => {
        canJump = true
        superMan.animation.play('idle')
    }, 650)
    superMan.body.applyForceY(6)
}