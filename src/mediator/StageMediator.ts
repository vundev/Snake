///<reference path="../view/stage/Stage.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace snake {
    import Mediator = puremvc.Mediator;
    import IProxy = puremvc.IProxy;
    import IMediator = puremvc.IMediator;
    import Stage = snake.Stage;
    export class StageMediator extends Mediator implements IMediator {
        public static NAME: string = 'StageMediator'

        constructor() {
            super(StageMediator.NAME)
        }

        onRegister(): void {
            super.onRegister()
            this.viewComponent = new Stage({
                stageWidth: 1024,
                stageHeight: 640
            })
        }

        public get view(): Stage {
            return this.viewComponent as Stage
        }
    }
}