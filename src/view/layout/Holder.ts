///<reference path="../../util/ArrayTools.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace layout {
    import Container = PIXI.Container;
    import ArrayTools = util.ArrayTools;
    import Hash = util.Hash;
    import Sprite = PIXI.Sprite;
    import DisplayObject = PIXI.DisplayObject;
    export class Holder extends Container {
        protected _options: any

        constructor(options?: any) {
            super()
            this._options = new Hash({
                autoDispose: true
            }).merge(options)

            // dispatched when this object is removed with removeChild method
            if (this._options.autoDispose)
                this.on('removed', this.onRemoveFromDisplayTree, this)
        }

        private onRemoveFromDisplayTree(event): void {
            this.off('removed', this.onRemoveFromDisplayTree, this)
            this.dispose()
        }

        public dispose(): void {
            if (this.hasListener('removed'))
                this.off('removed', this.onRemoveFromDisplayTree, this)
            const length: number = this.children.length
            for (var i = 0; i < length; i++) {
                let child: any = this.children[i]
                if (typeof child.dispose == 'function')
                    child.dispose()
            }
        }

        public attrs(options?: any): any {
            if (options) {
                var keys: Array<string> = Object.keys(options)
                for (var name of keys)
                    this[name] = options[name]
            }
            return this
        }

        public addChildren(...rest: any[]): void {
            const children: Array<any> = ArrayTools.flatten(rest)
            const length: number = children.length
            for (var i = 0; i < length; i++) {
                // do not re-add the child, because its removed event will be dispatched
                if (children[i].parent == this)
                    continue
                this.addChild(children[i])
            }
        }

        public hasListener(type: string): boolean {
            return this.listeners(type).length > 0
        }
    }
}