/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */

namespace util {
    import ArrayTools = util.ArrayTools;
    export class Vector<T> {
        private _type: { new(): T; }
        items: Array<T> = []

        constructor(type: { new(): T; }) {
            this._type = type
        }

        get type(): any {
            return this._type
        }

        get length(): number {
            return this.items.length
        }

        map(callback: (e: T, i: number, vector: Vector<T>)=>T): Vector<T> {
            const length: number = this.length
            const mapped: Vector<T> = new Vector<T>(this.type)
            for (var i = 0; i < length; i++) {
                mapped.items.push(callback(this.items[i], i, this))
            }
            return mapped
        }
    }
}