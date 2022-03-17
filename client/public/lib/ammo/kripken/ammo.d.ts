//declare module './ammo.cjs';

declare function Ammo<T>(api?: T): Promise<T & typeof Ammo>;