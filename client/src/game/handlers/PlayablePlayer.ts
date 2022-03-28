import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type { propsAll } from '../../../../server/src/shared/types'
import type { Types } from '@geckos.io/snapshot-interpolation'

import { Player } from './Player'
import { Scene3D, THREE, JoyStick, ThirdPersonControls, PointerLock, PointerDrag } from 'enable3d';
import { sendMovement, sendRotation, sendJump } from '../coms'
import { Vault } from '@geckos.io/snapshot-interpolation';
import { rotate } from '../../../../server/src/shared/handlerHelpers/base/dynamicObject'
import { movePlayerForward } from '../../../../server/src/shared/handlerHelpers/player'
import { SI } from '../updates'

/**
 * Is touch device?
 */
const isTouchDevice = 'ontouchstart' in window

export let playerId: string;
export const playerVault = new Vault()

export let controlsDoJump = false 

export function setPlayableCharacterID(id: string) {
    playerId = id
}

export function setControlsDoJump(value: boolean) {
    controlsDoJump = value
}

export class PlayablePlayer extends Player {
    #keys;
    #moveTop = 0
    #moveRight = 0
    #move = false
    #canJump = true;
    #controls;
    #scene;

    constructor(scene: Scene3D, physicsProps: propsAll, model: GLTF) {
        super(scene, physicsProps, model, false);

        this.#scene = scene

        this.#setKeys();
        this.#setJoystick();
        this.#setCamera();
    }

    update(delta: number, objectProps: propsAll) {
        super.update(delta, objectProps)

        const object3d = this.object3d

        object3d.body.setVelocity(0, 0, 0)

        this.#updateControls()
        const theta = this.#rotate()
        this.#movePlayer(theta)
        this.#jump()

        playerVault.add(
            SI.snapshot.create([{ id: this.props.id, x: object3d.position.x, y: object3d.position.y, z: object3d.position.z }])
        )

        this.serverPositionReconciliation(delta)
    }

    serverPositionReconciliation(delta: number) {
        const object3d = this.object3d

        // get the latest snapshot from the server
        const serverSnapshot = SI.vault.get()
        // get the closest player snapshot that matches the server snapshot time
        const playerSnapshot = playerVault.get(serverSnapshot.time, true)

        if (serverSnapshot && playerSnapshot) {

            const state = serverSnapshot.state as Types.State
            const serverPos = state.filter(s => s.id === this.props.id)[0] as propsAll

            // calculate the offset between server and client
            let offsetX = serverPos.x - playerSnapshot.state[0].x
            let offsetY = serverPos.y - playerSnapshot.state[0].y
            let offsetZ = serverPos.z - playerSnapshot.state[0].z


            object3d.body.applyForceX(offsetX * delta)
            object3d.body.applyForceY(offsetY * delta)
            object3d.body.applyForceZ(offsetZ * delta)
        }
    }

    #setKeys() {
        let keys = this.#keys

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

        this.#keys = keys
    }

    #setJoystick() {
        let moveTop = this.#moveTop
        let moveRight = this.#moveRight
        let move = this.#move

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
            buttonA.onClick(() => this.#jump())
            const buttonB = joystick.add.button({
                letter: 'B',
                styles: { right: 110, bottom: 35, size: 80 }
            })
            buttonB.onClick(() => (move = true))
            buttonB.onRelease(() => (move = false))
        }

        this.#moveTop = moveTop
        this.#moveRight = moveRight
        this.#move = move
    }

    #setCamera() {
        const object3d = this.object3d
        const scene = this.#scene
        let controls = this.#controls

        console.log("dasdsad");
        console.log(object3d);
        /**
         * Add 3rd Person Controls
         */
        controls = new ThirdPersonControls(scene.camera, object3d, {
            offset: new THREE.Vector3(0, 1, 0),
            targetRadius: 3
        })
        // set initial view to 90 deg theta
        controls.theta = 90
        
        // object3d.add(scene.camera)

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

        this.#controls = controls
    }

    #updateControls() {
        const controls = this.#controls
        const moveRight = this.#moveRight
        const moveTop = this.#moveTop

        /**
         * Update Controls
         */
        controls.update(moveRight * 2, -moveTop * 2)
    }

    #jump() {
        const keys = this.#keys
        const canJump = this.#canJump

        const startJump = keys.space.isDown || controlsDoJump
        /**
         * Player Jump
         */
        if (startJump && canJump) {
            controlsDoJump = false
            this.#canJump = false

            setTimeout(() => {
                this.#canJump = true
            }, 1000)

            this.jump()
            sendJump(true)
        }
    }

    #rotate(): number {
        const object3d = this.object3d
        const scene = this.#scene

        const v3 = new THREE.Vector3()
        const rotation = scene.camera.getWorldDirection(v3)
        const theta = Math.atan2(rotation.x, rotation.z)
        rotate(object3d, theta)
        sendRotation(0, theta, 0)

        return theta
    }

    #movePlayer(theta: number) {
        const object3d = this.object3d
        const keys = this.#keys
        const move = this.#move
        const canJump = this.#canJump

        /**
         * Player Move
         */
        if (keys.w.isDown || move) {
            if (object3d.anims.current === 'idle' && canJump) object3d.anims.play('run')

            movePlayerForward(object3d, theta);
            sendMovement(true, theta)

        } else {
            if (object3d.anims.current === 'run' && canJump) object3d.anims.play('idle')
            sendMovement(false, theta)
        }
    }
}

export async function buildPlayablePlayerObject(scene: Scene3D, physicsProps: propsAll): Promise<PlayablePlayer> {
    try {
        const object: GLTF = await scene.load.gltf('man')

        const player = new PlayablePlayer(scene, physicsProps, object)

        return player;
    } catch (e) {
        console.log("Error Creating Playable Player: " + e);
    }
}