import type { propsAll } from '../shared/types.js'
import { sendObjects } from './coms.js';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { BaseHandler } from './handlers/base/BaseHandler.js'

const SI = new SnapshotInterpolation();

type objectsType = { [key: string]: BaseHandler }
export var objects: objectsType = {};

export function updateSnapshot() {
    var allPropsArray: propsAll[] = Object.values(objects).map(function (obj) {
        return obj.getAllProps()
    });

    const snapshot = SI.snapshot.create(allPropsArray);
    SI.vault.add(snapshot);

    sendObjects(snapshot);
}

export function updateObjects(delta: number) {
    Object.values(objects).map(function (object) {
        object.update(delta)
    });
}
