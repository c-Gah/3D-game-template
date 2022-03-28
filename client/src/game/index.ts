import { Project, PhysicsLoader, Scene3D } from 'enable3d';
import { loadAssets } from './assets'
import { setupComs } from './coms'
import { worldUpdate } from './updates'

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
        // Setup world settings
        const { lights } = await this.warpSpeed('-ground', '-orbitControls')
        
        const { hemisphereLight, ambientLight, directionalLight } = lights
        const intensity = 0.65
        hemisphereLight.intensity = intensity
        ambientLight.intensity = intensity
        directionalLight.intensity = intensity

        // scene3D.physics.debug.enable()

        setTimeout(() => {
            const placeholder = document.getElementById('welcome-game-placeholder')
            if (placeholder) placeholder.remove()
        }, 500)

        // Start the world coms
        setupComs(this);
        
        //window.onresize = this.resize()
        // this.resize()
    }

    resize = () => {
        const newWidth = window.innerWidth
        const newHeight = window.innerHeight

        this.renderer.setSize(newWidth, newHeight)

        //TODO create an actual perspective camera
        //const camera = this.camera as 
        // @ts-expect-error
        this.camera.aspect = newWidth / newHeight
        this.camera.updateProjectionMatrix()
    }

    update(time: number, delta: number) {
        worldUpdate(time, delta, this);
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