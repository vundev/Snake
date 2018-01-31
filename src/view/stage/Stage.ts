///<reference path="../../util/Hash.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace snake {
    import Container = PIXI.Container;
    import Hash = util.Hash;
    export class Stage {
        protected _stage: Container
        protected _renderer: any

        constructor(options?) {

            options = new Hash({stageWidth: 500, stageHeight: 500, canvasID: 'stage'}).merge(options)

            // Starts rendering canvas.
            this._renderer = PIXI.autoDetectRenderer(options.stageWidth, options.stageHeight, {roundPixels: true});
            $('#' + options.canvasID).append(this._renderer.view);
            this._renderer.backgroundColor = 0x666666;
            this._stage = new PIXI.Container();
            this.animate()
        }

        private animate(): void {
            this._renderer.render(this._stage);
            const that: Stage = this
            requestAnimationFrame(function () {
                that.animate()
            });
        }

        public get stage(): PIXI.Container {
            return this._stage
        }
    }
}