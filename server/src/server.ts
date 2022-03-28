// Expect error from loading a no typed CommonJS file. Also from build folder, reference src location
// @ts-expect-error
import _ammo from '../src/lib/ammo/ammo.cjs';
import AmmoNodeJS from '@enable3d/ammo-on-nodejs';
const { Physics, ServerClock } = AmmoNodeJS;

import { startComs } from './game/coms.js';
import { updateObjects, updateSnapshot } from './game/updates.js';
import { loadMap } from './game/loader.js';

let tick = 0;

async function ServerScene(ammo: any) {
    let physics: AmmoNodeJS.Physics = new Physics();
    let factory = physics.factory;

    console.log('Ammo', new ammo.btVector3(1, 2, 3).y() === 2)

    startComs(physics, factory);

    await loadMap(physics);

    // clock
    const clock = new ServerClock(60, true)
    //constructor(fps?: number, autoStart?: boolean);

    // for debugging you disable high accuracy
    // high accuracy uses much more cpu power
    if (process.env.NODE_ENV !== 'production') {
        clock.disableHighAccuracy()
    }

    clock.onTick(delta => update(delta))

    function update(delta: number) {
        physics.update(delta * 1000);

        // Only update on ticks
        tick++

        // only send the update to the client at 30 FPS (save bandwidth)
        if (tick % 2 !== 0) return

        updateSnapshot()
        updateObjects(delta);
    }
}

// wait for Ammo to be loaded
_ammo().then((ammo: any) => {
    //globalThis.Ammo = ammo
    //globalAmmo = ammo;

    // start server scene
    ServerScene(ammo)
})