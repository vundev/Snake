///<reference path="IMovieClip.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace layout {
    import MovieClip = PIXI.extras.MovieClip;
    import Texture = PIXI.Texture;
    export class SpriteSheet extends MovieClip implements IMovieClip {
        protected _frames: Array<Frame>

        constructor(frames: Array<Frame>) {
            this._frames = frames
            super(this.frames())
        }

        private frames(): Array<Texture> {
            const frames: Array<Texture> = []
            const length: number = this._frames.length
            for (var i = 0; i < length; i++)
                frames[i] = this._frames[i].texture
            return frames
        }

        public gotoAndStopToLabel(label: string): void {
            const length: number = this._frames.length
            for (var i = 0; i < length; i++) {
                if (this._frames[i].label == label) {
                    this.gotoAndStop(i)
                    break
                }
            }
        }

        public dispose(): void {
            const length: number = this._frames.length
            for (var i = 0; i < length; i++)
                this._frames[i].dispose()
            this._frames.length = 0
        }
    }

    export class Frame {
        public texture: Texture
        public label: string

        constructor(texture: Texture, label?: string) {
            this.texture = texture
            this.label = label
        }

        public dispose(): void {
            this.texture = null
        }
    }
}