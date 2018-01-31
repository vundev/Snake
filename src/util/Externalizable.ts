///<reference path="Collection.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace util {
    import Vector = util.Vector;
    export class Externalizable {
        serialize(withObject: any): Externalizable {
            if (withObject == null) {
                return null;
            }
            const keys: Array<string> = Object.keys(this);
            for (var name of keys) {
                if (this[name] instanceof Externalizable) {
                    (this[name] as Externalizable).serialize(withObject[name]);
                }
                else if (name in withObject) {
                    // map an array of complex items with vector with serializable items
                    if (this[name] instanceof Vector) {
                        var length: number = withObject[name].length;
                        var vectorType = this[name].type;
                        var vector = this[name];
                        for (var i: number = 0; i < length; i++) {
                            vector.items[i] = new vectorType();
                            if (vector.items[i] instanceof Externalizable) {
                                (vector.items[i] as Externalizable).serialize(withObject[name][i]);
                            } else {
                                vector.items[i] = withObject[name][i];
                            }

                        }
                    }
                    else this[name] = withObject[name];
                }
            }
            return this;
        }
    }


}