import { Project, PhysicsLoader, Scene3D, ExtendedObject3D, THREE, JoyStick, ThirdPersonControls, PointerLock, PointerDrag } from 'enable3d';
import { loadAssets } from './assets'
import { createObjects, objectUpdate } from './map'
import { setupComs } from './coms'

/**
 * Is touch device?
 */
const isTouchDevice = 'ontouchstart' in window

class MainScene extends Scene3D {
    constructor() {
        super({ key: 'MainScene' })
    }

    init() {
        this.renderer.setPixelRatio(Math.max(1, window.devicePixelRatio / 2))
    }

    async preload() {
        loadAssets(this);
    }

    async create() {
        setupComs(this);
        createObjects(this);
    }

    update(time, delta) {
        objectUpdate(time, delta, this)
    }
}

export function startPhaserGame() {
    PhysicsLoader('/lib/ammo/kripken', () => {
        const project = new Project({
            antialias: false,
            maxSubSteps: 10,
            fixedTimeStep: 1 / 120,
            scenes: [MainScene],
            parent: "gameCanvasDev"
        })
    })
}