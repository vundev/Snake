///<reference path="../util/Externalizable.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace snake {
    import Externalizable = util.Externalizable;
    export class SnakeSettings extends Externalizable {
        rows: number = 30
        columns: number = 30
        speed: number = 100
    }
}