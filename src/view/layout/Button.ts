///<reference path="SpriteSheet.ts"/>
///<reference path="Holder.ts"/>
///<reference path="../../util/Capabilities.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace layout {
    import MovieClip = PIXI.extras.MovieClip;
    import Hash = util.Hash;
    import Graphics = PIXI.Graphics;
    import Capabilities = util.Capabilities;
    import EVENT_TYPE = util.EVENT_TYPE;

    export class Button extends Holder {
        private static STATE_UNSUPPORTED: number = 0xff0000;
        public src: SpriteSheet
        public label: PIXI.Text
        protected _state: string
        public graphics: Graphics = new Graphics()

        constructor(src: SpriteSheet = null, options: any = null) {
            super(options)
            this._options = new Hash({
                supportedStates: {
                    idle: 0xb0d911 // green
                },
                label: true,
                defaultGraphics: true,
                enableEff: false
            }).merge(this._options)

            this.src = src

            this.addChild(this.graphics)

            if (this.src)
                this.addChild(this.src)

            if (this._options.label) {
                this.createLabel()
                this.addChild(this.label)
            }

            if (this._options.enableEff) {
                this.on(Capabilities.eventType(EVENT_TYPE.DOWN), this.onDown, this)
                this.on(Capabilities.eventType(EVENT_TYPE.OVER), this.onOver, this)
                this.on(Capabilities.eventType(EVENT_TYPE.UP), this.onUp, this)
                this.on(Capabilities.eventType(EVENT_TYPE.OUT), this.onUp, this)
            }
        }

        public onOver(event?: any): void {
            try {
                this.src.gotoAndStopToLabel('over')
            }
            catch (error) {
                /*do nothing*/
            }
        }

        public onDown(event?: any): void {
            try {
                this.src.gotoAndStopToLabel('down')
            }
            catch (error) {
                /*do nothing*/
            }
        }

        public onUp(event?: any): void {
            try {
                this.src.gotoAndStopToLabel(this._state)
            }
            catch (error) {
                /*do nothing*/
            }
        }

        protected createLabel(): void {
            this.label = new PIXI.Text('Game Type', {
                font: 'Arial',
                fontSize: 13,
                fill: '#ffffff'
            })
            this.label.text = 'label';
        }

        public getState(): string {
            return this._state;
        }

        public setState(value: string) {
            this._state = value;
            try {
                this.src.gotoAndStopToLabel(this._state)
            }
            catch (error) {
                if (this._options.defaultGraphics) {
                    this.graphics.clear()
                    var color: number = this._options.supportedStates[this._state] != undefined ? this._options.supportedStates[this._state] : Button.STATE_UNSUPPORTED;
                    this.graphics.beginFill(color)
                    this.graphics.drawRect(0, 0, 44, 44)
                    this.graphics.endFill()
                }
            }
        }

        public dispose(): void {
            super.dispose()
            if (this.src && this.src.parent == this) {
                this.removeChild(this.src)
                this.src = null
            }
            if (this.label)
                this.label.destroy(true)
            this.label = null
            this.graphics = null
            if (this._options.enableEff) {
                this.removeAllListeners(Capabilities.eventType(EVENT_TYPE.DOWN))
                this.removeAllListeners(Capabilities.eventType(EVENT_TYPE.UP))
                this.removeAllListeners(Capabilities.eventType(EVENT_TYPE.OVER))
                this.removeAllListeners(Capabilities.eventType(EVENT_TYPE.OUT))
            }
        }
    }
}