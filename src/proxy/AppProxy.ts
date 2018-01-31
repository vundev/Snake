/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace snake {
    import Proxy = puremvc.Proxy;
    import TextureDictionary = PIXI.loaders.TextureDictionary;
    export class AppProxy extends Proxy {
        public static NAME: string = 'AppProxy'

        private _atlas: TextureDictionary
        private _content: any
        onLoad: () => void

        constructor() {
            super(AppProxy.NAME)
        }

        onRegister() {
            this.load()
        }

        private load() {
            const that = this
            var semaphore = 2

            // load atlas
            const loader = new PIXI.loaders.Loader()
            const url: string = this.libraryPath()
            loader.add(url)
            loader.load(function () {
                that._atlas = loader.resources[url].textures
                semaphore--
                if (semaphore == 0) {
                    that.onLoad.call(this)
                }
            })

            // load central content for the app
            $.ajax({
                cache: true,
                dataType: 'json',
                url: this.contentUrl(),
                contentType: 'application/json; charset=utf-8',
                crossDomain: false,
                success: function (data) {
                    that._content = data
                    semaphore--
                    if (semaphore == 0) {
                        that.onLoad.call(this)
                    }
                }
            })
        }

        private libraryPath(): string {
            return '../assets/library.json?version=' + VERSION
        }

        private contentUrl(): string {
            return '../assets/content.json?version=' + VERSION
        }

        public getTexture(name: string, ext: string = 'png'): any {
            if (this._atlas == null) return null
            return this._atlas[name + (ext ? ('.' + ext) : '')]
        }

        get content() {
            return this._content
        }
    }
}