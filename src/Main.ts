///<reference path="mediator/StageMediator.ts"/>
///<reference path="mediator/SnakeGridMediator.ts"/>
///<reference path="proxy/SnakeProxy.ts"/>
///<reference path="proxy/AppProxy.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare var VERSION: string
declare var DEBUG: boolean

namespace snake {
    import Facade = puremvc.Facade;
    import StageMediator = snake.StageMediator;
    export class Main {
        public static CORE_NAMESPACE: string = 'snake'

        constructor() {
            console.log('debug: ' + DEBUG)
            console.log('version: ' + VERSION)

            Facade.getInstance(Main.CORE_NAMESPACE).registerMediator(new StageMediator())
            Facade.getInstance(Main.CORE_NAMESPACE).registerProxy(new SnakeProxy())
            Facade.getInstance(Main.CORE_NAMESPACE).registerMediator(new SnakeGridMediator())
        }
    }

    export function start(onComplete: () => void) {
        // load json with setting
        // on json loading completion create instance of main
        const appProxy = new AppProxy()
        appProxy.onLoad = onComplete
        Facade.getInstance(Main.CORE_NAMESPACE).registerProxy(appProxy)
    }
}