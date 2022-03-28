import type { propsAll } from '../../../../server/src/shared/types'

export function init(physics: any, props: propsAll) {
    
    const box = physics.add.box(props, { lambert: { color: 'green' } })
    //physics.add.existing(object, box)
    //physics.add.existing(object, props)

    //physics.destroy(box)
    //object.body.setCollisionFlags(props.collisionFlags ?? 0);

    return box
}