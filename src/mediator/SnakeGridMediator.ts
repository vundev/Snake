///<reference path="../view/stage/Stage.ts"/>
///<reference path="../view/snake_grid/SnakeGrid.ts"/>
///<reference path="../view/snake_grid/SnakeGridOptimized.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace snake {
    import Mediator = puremvc.Mediator;
    import IProxy = puremvc.IProxy;
    import IMediator = puremvc.IMediator;
    import Stage = snake.Stage;
    import Frame = layout.Frame;
    export class SnakeGridMediator extends Mediator implements IMediator {
        public static NAME: string = 'SnakeGridMediator'
        private _proxy: SnakeProxy

        constructor() {
            super(SnakeGridMediator.NAME)
        }

        onRegister(): void {
            super.onRegister()

            const that = this
            this._proxy = this.facade().retrieveProxy(SnakeProxy.NAME) as SnakeProxy;
            const appProxy: AppProxy = this.facade().retrieveProxy(AppProxy.NAME) as AppProxy;
            const scoreLabel: PIXI.Text = new PIXI.Text('Score', {fontSize: 20, fill: '#000000'});
            // this.viewComponent = new SnakeGrid(this._proxy.settings.rows, this._proxy.settings.columns, {
            //     cellFrames: [
            //         new Frame(appProxy.getTexture('grey'), 'idle'),
            //         new Frame(appProxy.getTexture('yellow'), 'selected')
            //     ]
            // })
            this.viewComponent = new SnakeGridOptimized(this._proxy.settings.rows, this._proxy.settings.columns, {
                cellIdle: appProxy.getTexture('grey'),
                cellSelected: appProxy.getTexture('yellow')
            })
            this._proxy.onUpdate = function () {
                that.viewComponent.update(this.snake, this.food)
                scoreLabel.text = 'Score: ' + this.score
            }
            this._proxy.onGameOver = function () {
                alert("Game Over with score: " + this.score)
                location.reload()
            }

            const stage: StageMediator = this.facade().retrieveMediator(StageMediator.NAME) as StageMediator;
            stage.view.stage.addChild(this.viewComponent)
            stage.view.stage.addChild(scoreLabel)

            this._proxy.start()

            scoreLabel.x = this.viewComponent.x + this.viewComponent.width + 10
        }
    }
}