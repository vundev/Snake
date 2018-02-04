/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var util;
(function (util) {
    var Hash = (function () {
        function Hash(object) {
            if (object === void 0) { object = null; }
            if (object)
                this.merge(object);
        }
        Hash.prototype.merge = function (object, recursive) {
            if (recursive === void 0) { recursive = true; }
            if (object == undefined)
                return this;
            var keys = Object.keys(object);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                if (object[name] !== null) {
                    //trace('=>', name, recursive, this.instanceIsObjOrHash(this[name]), this.instanceIsObjOrHash(object[name]), this[name], object[name])
                    if (recursive && this.instanceIsObjOrHash(this[name]) && this.instanceIsObjOrHash(object[name]))
                        this[name] = new Hash(this[name]).merge(object[name], recursive);
                    else
                        this[name] = object[name];
                }
            }
            return this;
        };
        Hash.prototype.instanceIsObjOrHash = function (instance) {
            return instance != undefined && (instance.constructor.name === 'Object' || instance.constructor.className === Hash.className);
        };
        Hash.prototype.isEmpty = function () {
            return Object.keys(this).length == 0;
        };
        Hash.prototype.has = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i - 0] = arguments[_i];
            }
            for (var _a = 0; _a < rest.length; _a++) {
                var needle = rest[_a];
                if (needle instanceof Array && this.has.apply(this, needle))
                    return true;
                else if (this[needle] !== undefined)
                    return true;
            }
            return false;
        };
        Object.defineProperty(Hash.prototype, "length", {
            get: function () {
                return Object.keys(this).length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hash.prototype, "values", {
            get: function () {
                var v = [];
                var keys = Object.keys(this);
                for (var _i = 0; _i < keys.length; _i++) {
                    var name = keys[_i];
                    v.push(this[name]);
                }
                return v;
            },
            enumerable: true,
            configurable: true
        });
        Hash.prototype.diff = function (other) {
            var h = new Hash();
            var keys = Object.keys(this);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                if (other[name] === undefined || other[name] != this[name])
                    h[name] = this[name];
            }
            return h;
        };
        Hash.prototype.mapValues = function (callback) {
            var h = new Hash();
            var keys = Object.keys(this);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                h[name] = callback(name, this[name]);
            }
            return h;
        };
        Hash.prototype.dup = function () {
            return new Hash(this);
        };
        Hash.prototype.withoutKeys = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var keys = args[0] instanceof Array ? args[0] : args;
            var h = new Hash();
            this.forEach(function (k, v) {
                if (keys.indexOf(k) < 0)
                    h[k] = this[k];
            });
            return h;
        };
        Hash.prototype.forEach = function (check) {
            var keys = Object.keys(this);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                check.call(this, name, this[name]);
            }
        };
        Hash.prototype.toObject = function () {
            var object = {};
            this.forEach(function (k, v) {
                object[k] = this[k];
            });
            return object;
        };
        Hash.className = 'gamy.Hash';
        return Hash;
    })();
    util.Hash = Hash;
})(util || (util = {}));
///<reference path="../../util/Hash.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var snake;
(function (snake) {
    var Hash = util.Hash;
    var Stage = (function () {
        function Stage(options) {
            options = new Hash({ stageWidth: 500, stageHeight: 500, canvasID: 'stage' }).merge(options);
            // Starts rendering canvas.
            this._renderer = PIXI.autoDetectRenderer(options.stageWidth, options.stageHeight, { roundPixels: true });
            $('#' + options.canvasID).append(this._renderer.view);
            this._renderer.backgroundColor = 0x666666;
            this._stage = new PIXI.Container();
            this.animate();
        }
        Stage.prototype.animate = function () {
            this._renderer.render(this._stage);
            var that = this;
            requestAnimationFrame(function () {
                that.animate();
            });
        };
        Object.defineProperty(Stage.prototype, "stage", {
            get: function () {
                return this._stage;
            },
            enumerable: true,
            configurable: true
        });
        return Stage;
    })();
    snake.Stage = Stage;
})(snake || (snake = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../view/stage/Stage.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var snake;
(function (snake) {
    var Mediator = puremvc.Mediator;
    var Stage = snake.Stage;
    var StageMediator = (function (_super) {
        __extends(StageMediator, _super);
        function StageMediator() {
            _super.call(this, StageMediator.NAME);
        }
        StageMediator.prototype.onRegister = function () {
            _super.prototype.onRegister.call(this);
            this.viewComponent = new Stage({
                stageWidth: 1024,
                stageHeight: 640
            });
        };
        Object.defineProperty(StageMediator.prototype, "view", {
            get: function () {
                return this.viewComponent;
            },
            enumerable: true,
            configurable: true
        });
        StageMediator.NAME = 'StageMediator';
        return StageMediator;
    })(Mediator);
    snake.StageMediator = StageMediator;
})(snake || (snake = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var util;
(function (util) {
    var ArrayTools = (function () {
        function ArrayTools() {
            throw new Error('static class');
        }
        ArrayTools.has = function (collection, what) {
            return collection.indexOf(what) > -1;
        };
        ArrayTools.print = function (array) {
            var output = '';
            var length = array.length;
            for (var i = 0; i < length; i++) {
                var comma = i == length - 1 ? '' : ',';
                var element = array[i];
                if (element instanceof Array)
                    output += ArrayTools.print(element) + comma;
                else if (element.constructor.name === "Object")
                    output += new util.Hash(element).toString() + comma;
                else
                    output += element + comma;
            }
            return '[' + output + ']';
        };
        ArrayTools.isEmpty = function (array) {
            return array.length == 0;
        };
        ArrayTools.remove = function (array, elem) {
            return array.filter(function (item, index, arr) {
                return item != elem;
            });
        };
        ArrayTools.diff = function (array, compare) {
            var unique = [];
            var length = array.length;
            for (var i = 0; i < length; i++)
                if (!ArrayTools.has(compare, array[i]))
                    unique.push(array[i]);
            return unique;
        };
        ArrayTools.intersect = function (array1, array2) {
            var intersection = [];
            var l1 = array1.length;
            var l2 = array2.length;
            if (l1 < l2) {
                for (var i = 0; i < l1; i++)
                    if (ArrayTools.has(array2, array1[i]))
                        intersection.push(array1[i]);
            }
            else {
                for (var i = 0; i < l2; i++)
                    if (ArrayTools.has(array1, array2[i]))
                        intersection.push(array2[i]);
            }
            return intersection;
        };
        ArrayTools.htmlCollectionToArray = function (collection) {
            return [].slice.call(collection);
        };
        ArrayTools.flatten = function (array) {
            var flattened = [];
            var length = array.length;
            for (var i = 0; i < length; i++) {
                var item = array[i];
                if (item instanceof Array)
                    flattened = flattened.concat(ArrayTools.flatten(item));
                else
                    flattened.push(item);
            }
            return flattened;
        };
        return ArrayTools;
    })();
    util.ArrayTools = ArrayTools;
})(util || (util = {}));
///<reference path="../../util/ArrayTools.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var layout;
(function (layout) {
    var Container = PIXI.Container;
    var ArrayTools = util.ArrayTools;
    var Hash = util.Hash;
    var Holder = (function (_super) {
        __extends(Holder, _super);
        function Holder(options) {
            _super.call(this);
            this._options = new Hash({
                autoDispose: true
            }).merge(options);
            // dispatched when this object is removed with removeChild method
            if (this._options.autoDispose)
                this.on('removed', this.onRemoveFromDisplayTree, this);
        }
        Holder.prototype.onRemoveFromDisplayTree = function (event) {
            this.off('removed', this.onRemoveFromDisplayTree, this);
            this.dispose();
        };
        Holder.prototype.dispose = function () {
            if (this.hasListener('removed'))
                this.off('removed', this.onRemoveFromDisplayTree, this);
            var length = this.children.length;
            for (var i = 0; i < length; i++) {
                var child = this.children[i];
                if (typeof child.dispose == 'function')
                    child.dispose();
            }
        };
        Holder.prototype.attrs = function (options) {
            if (options) {
                var keys = Object.keys(options);
                for (var _i = 0; _i < keys.length; _i++) {
                    var name = keys[_i];
                    this[name] = options[name];
                }
            }
            return this;
        };
        Holder.prototype.addChildren = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i - 0] = arguments[_i];
            }
            var children = ArrayTools.flatten(rest);
            var length = children.length;
            for (var i = 0; i < length; i++) {
                // do not re-add the child, because its removed event will be dispatched
                if (children[i].parent == this)
                    continue;
                this.addChild(children[i]);
            }
        };
        Holder.prototype.hasListener = function (type) {
            return this.listeners(type).length > 0;
        };
        return Holder;
    })(Container);
    layout.Holder = Holder;
})(layout || (layout = {}));
///<reference path="IMovieClip.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var layout;
(function (layout) {
    var MovieClip = PIXI.extras.MovieClip;
    var SpriteSheet = (function (_super) {
        __extends(SpriteSheet, _super);
        function SpriteSheet(frames) {
            this._frames = frames;
            _super.call(this, this.frames());
        }
        SpriteSheet.prototype.frames = function () {
            var frames = [];
            var length = this._frames.length;
            for (var i = 0; i < length; i++)
                frames[i] = this._frames[i].texture;
            return frames;
        };
        SpriteSheet.prototype.gotoAndStopToLabel = function (label) {
            var length = this._frames.length;
            for (var i = 0; i < length; i++) {
                if (this._frames[i].label == label) {
                    this.gotoAndStop(i);
                    break;
                }
            }
        };
        SpriteSheet.prototype.dispose = function () {
            var length = this._frames.length;
            for (var i = 0; i < length; i++)
                this._frames[i].dispose();
            this._frames.length = 0;
        };
        return SpriteSheet;
    })(MovieClip);
    layout.SpriteSheet = SpriteSheet;
    var Frame = (function () {
        function Frame(texture, label) {
            this.texture = texture;
            this.label = label;
        }
        Frame.prototype.dispose = function () {
            this.texture = null;
        };
        return Frame;
    })();
    layout.Frame = Frame;
})(layout || (layout = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var util;
(function (util) {
    function isMobile() {
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        else {
            return false;
        }
    }
    util.isMobile = isMobile;
})(util || (util = {}));
///<reference path="GlobalFunctions.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var util;
(function (util) {
    (function (EVENT_TYPE) {
        EVENT_TYPE[EVENT_TYPE["CLICK"] = 0] = "CLICK";
        EVENT_TYPE[EVENT_TYPE["MOVE"] = 1] = "MOVE";
        EVENT_TYPE[EVENT_TYPE["DOWN"] = 2] = "DOWN";
        EVENT_TYPE[EVENT_TYPE["UP"] = 3] = "UP";
        EVENT_TYPE[EVENT_TYPE["OVER"] = 4] = "OVER";
        EVENT_TYPE[EVENT_TYPE["OUT"] = 5] = "OUT";
    })(util.EVENT_TYPE || (util.EVENT_TYPE = {}));
    var EVENT_TYPE = util.EVENT_TYPE;
    var Capabilities = (function () {
        function Capabilities() {
            throw new Error('static class');
        }
        Object.defineProperty(Capabilities, "scaleFactor", {
            get: function () {
                if (window.devicePixelRatio < 2)
                    return 1;
                else if (window.devicePixelRatio < 3)
                    return 2;
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Capabilities.eventType = function (type) {
            switch (type) {
                case EVENT_TYPE.CLICK:
                    return util.isMobile() ? 'tap' : 'click';
                case EVENT_TYPE.MOVE:
                    return util.isMobile() ? 'touchmove' : 'mousemove';
                case EVENT_TYPE.DOWN:
                    return util.isMobile() ? 'touchstart' : 'mousedown';
                case EVENT_TYPE.UP:
                    return util.isMobile() ? 'touchend' : 'mouseup';
                case EVENT_TYPE.OVER:
                    return util.isMobile() ? 'pointerover' : 'mouseover';
                case EVENT_TYPE.OUT:
                    return util.isMobile() ? 'touchendoutside' : 'mouseout';
            }
            return null;
        };
        Capabilities.isPrimaryTouchPoint = function (event) {
            if (util.isMobile()) {
                var touches = event.data.originalEvent.touches;
                return touches.length == 0 ? true : event.data.identifier == touches[0].identifier;
            }
            return true;
        };
        return Capabilities;
    })();
    util.Capabilities = Capabilities;
})(util || (util = {}));
///<reference path="SpriteSheet.ts"/>
///<reference path="Holder.ts"/>
///<reference path="../../util/Capabilities.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var layout;
(function (layout) {
    var Hash = util.Hash;
    var Graphics = PIXI.Graphics;
    var Capabilities = util.Capabilities;
    var EVENT_TYPE = util.EVENT_TYPE;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(src, options) {
            if (src === void 0) { src = null; }
            if (options === void 0) { options = null; }
            _super.call(this, options);
            this.graphics = new Graphics();
            this._options = new Hash({
                supportedStates: {
                    idle: 0xb0d911 // green
                },
                label: true,
                defaultGraphics: true,
                enableEff: false
            }).merge(this._options);
            this.src = src;
            this.addChild(this.graphics);
            if (this.src)
                this.addChild(this.src);
            if (this._options.label) {
                this.createLabel();
                this.addChild(this.label);
            }
            if (this._options.enableEff) {
                this.on(Capabilities.eventType(EVENT_TYPE.DOWN), this.onDown, this);
                this.on(Capabilities.eventType(EVENT_TYPE.OVER), this.onOver, this);
                this.on(Capabilities.eventType(EVENT_TYPE.UP), this.onUp, this);
                this.on(Capabilities.eventType(EVENT_TYPE.OUT), this.onUp, this);
            }
        }
        Button.prototype.onOver = function (event) {
            try {
                this.src.gotoAndStopToLabel('over');
            }
            catch (error) {
            }
        };
        Button.prototype.onDown = function (event) {
            try {
                this.src.gotoAndStopToLabel('down');
            }
            catch (error) {
            }
        };
        Button.prototype.onUp = function (event) {
            try {
                this.src.gotoAndStopToLabel(this._state);
            }
            catch (error) {
            }
        };
        Button.prototype.createLabel = function () {
            this.label = new PIXI.Text('Game Type', {
                font: 'Arial',
                fontSize: 13,
                fill: '#ffffff'
            });
            this.label.text = 'label';
        };
        Button.prototype.getState = function () {
            return this._state;
        };
        Button.prototype.setState = function (value) {
            this._state = value;
            try {
                this.src.gotoAndStopToLabel(this._state);
            }
            catch (error) {
                if (this._options.defaultGraphics) {
                    this.graphics.clear();
                    var color = this._options.supportedStates[this._state] != undefined ? this._options.supportedStates[this._state] : Button.STATE_UNSUPPORTED;
                    this.graphics.beginFill(color);
                    this.graphics.drawRect(0, 0, 44, 44);
                    this.graphics.endFill();
                }
            }
        };
        Button.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.src && this.src.parent == this) {
                this.removeChild(this.src);
                this.src = null;
            }
            if (this.label)
                this.label.destroy(true);
            this.label = null;
            this.graphics = null;
            if (this._options.enableEff) {
                this.removeAllListeners(Capabilities.eventType(EVENT_TYPE.DOWN));
                this.removeAllListeners(Capabilities.eventType(EVENT_TYPE.UP));
                this.removeAllListeners(Capabilities.eventType(EVENT_TYPE.OVER));
                this.removeAllListeners(Capabilities.eventType(EVENT_TYPE.OUT));
            }
        };
        Button.STATE_UNSUPPORTED = 0xff0000;
        return Button;
    })(layout.Holder);
    layout.Button = Button;
})(layout || (layout = {}));
///<reference path="../layout/Holder.ts"/>
///<reference path="../layout/Button.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var snake;
(function (snake_1) {
    var Holder = layout.Holder;
    var Button = layout.Button;
    var SpriteSheet = layout.SpriteSheet;
    var SnakeGrid = (function (_super) {
        __extends(SnakeGrid, _super);
        function SnakeGrid(rows, columns, design) {
            _super.call(this);
            this.previous_snake = [];
            design = design || {};
            this.rows = rows;
            this.columns = columns;
            var padding = 2;
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    var cell = new Button(design.cellFrames ? new SpriteSheet(design.cellFrames) : null, {
                        supportedStates: {
                            selected: 0xff0000
                        },
                        label: false
                    });
                    this.addChild(cell);
                    // cell.label.text = String(this.columns * j + i);
                    cell.setState('idle');
                    cell.x = j * (cell.width + padding);
                    cell.y = i * (cell.height + padding);
                }
            }
        }
        SnakeGrid.prototype.clear = function () {
            if (this.previous_snake.length > 0) {
                var length_1 = this.previous_snake.length;
                for (var i = 0; i < length_1; i++) {
                    this.getCell(this.previous_snake[i]).setState('idle');
                }
                if (this.previous_food) {
                    this.getCell(this.previous_food).setState('idle');
                }
            }
        };
        SnakeGrid.prototype.update = function (snake, food) {
            this.clear();
            var length = snake.length;
            for (var i = 0; i < length; i++) {
                this.getCell(snake[i]).setState('selected');
            }
            this.getCell(food).setState('selected');
            this.previous_food = food;
            this.previous_snake = this.clone(snake);
        };
        SnakeGrid.prototype.clone = function (snake) {
            var clone = [];
            var length = snake.length;
            for (var i = 0; i < length; i++) {
                clone[i] = snake[i].clone();
            }
            return clone;
        };
        SnakeGrid.prototype.getCell = function (point) {
            return this.children[this.columns * point.y + point.x];
        };
        return SnakeGrid;
    })(Holder);
    snake_1.SnakeGrid = SnakeGrid;
})(snake || (snake = {}));
///<reference path="../layout/Holder.ts"/>
///<reference path="../layout/Button.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var snake;
(function (snake_2) {
    var Holder = layout.Holder;
    var TilingSprite = PIXI.extras.TilingSprite;
    var Texture = PIXI.Texture;
    var Sprite = PIXI.Sprite;
    var Container = PIXI.Container;
    var SnakeGridOptimized = (function (_super) {
        __extends(SnakeGridOptimized, _super);
        function SnakeGridOptimized(rows, columns, design) {
            _super.call(this);
            this.snakeAndFood = new Container();
            design = design || {};
            this.rows = rows;
            this.columns = columns;
            if (design.cellIdle instanceof Texture && design.cellSelected instanceof Texture) {
                this.cellIdle = design.cellIdle;
                this.cellSelected = design.cellSelected;
                this.grid = new TilingSprite(design.cellIdle, columns * this.cellIdle.width, rows * this.cellIdle.height);
                this.addChild(this.grid);
                this.addChild(this.snakeAndFood);
            }
        }
        SnakeGridOptimized.prototype.update = function (snake, food) {
            // this.snakeAndFood.removeChildren()
            // snake = snake.concat(food)
            // const length: number = snake.length
            // for (var i = 0; i < length; i++) {
            //     var cell: Sprite = new Sprite(this.cellSelected)
            //     this.snakeAndFood.addChild(cell)
            //     cell.x = snake[i].x * cell.width
            //     cell.y = snake[i].y * cell.height
            // }
            snake = snake.concat(food);
            var length = snake.length;
            for (var i = 0; i < length; i++) {
                if (this.snakeAndFood.children[i] != undefined) {
                    var cell = this.snakeAndFood.children[i];
                }
                else {
                    cell = new Sprite(this.cellSelected);
                    this.snakeAndFood.addChild(cell);
                }
                cell.x = snake[i].x * cell.width;
                cell.y = snake[i].y * cell.height;
            }
        };
        return SnakeGridOptimized;
    })(Holder);
    snake_2.SnakeGridOptimized = SnakeGridOptimized;
})(snake || (snake = {}));
///<reference path="../view/stage/Stage.ts"/>
///<reference path="../view/snake_grid/SnakeGrid.ts"/>
///<reference path="../view/snake_grid/SnakeGridOptimized.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var snake;
(function (snake) {
    var Mediator = puremvc.Mediator;
    var SnakeGridMediator = (function (_super) {
        __extends(SnakeGridMediator, _super);
        function SnakeGridMediator() {
            _super.call(this, SnakeGridMediator.NAME);
        }
        SnakeGridMediator.prototype.onRegister = function () {
            _super.prototype.onRegister.call(this);
            var that = this;
            this._proxy = this.facade().retrieveProxy(snake.SnakeProxy.NAME);
            var appProxy = this.facade().retrieveProxy(snake.AppProxy.NAME);
            var scoreLabel = new PIXI.Text('Score', { fontSize: 20, fill: '#000000' });
            // this.viewComponent = new SnakeGrid(this._proxy.settings.rows, this._proxy.settings.columns, {
            //     cellFrames: [
            //         new Frame(appProxy.getTexture('grey'), 'idle'),
            //         new Frame(appProxy.getTexture('yellow'), 'selected')
            //     ]
            // })
            this.viewComponent = new snake.SnakeGridOptimized(this._proxy.settings.rows, this._proxy.settings.columns, {
                cellIdle: appProxy.getTexture('grey'),
                cellSelected: appProxy.getTexture('yellow')
            });
            this._proxy.onUpdate = function () {
                that.viewComponent.update(this.snake, this.food);
                scoreLabel.text = 'Score: ' + this.score;
            };
            this._proxy.onGameOver = function () {
                alert("Game Over with score: " + this.score);
                location.reload();
            };
            var stage = this.facade().retrieveMediator(snake.StageMediator.NAME);
            stage.view.stage.addChild(this.viewComponent);
            stage.view.stage.addChild(scoreLabel);
            this._proxy.start();
            scoreLabel.x = this.viewComponent.x + this.viewComponent.width + 10;
        };
        SnakeGridMediator.NAME = 'SnakeGridMediator';
        return SnakeGridMediator;
    })(Mediator);
    snake.SnakeGridMediator = SnakeGridMediator;
})(snake || (snake = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var util;
(function (util) {
    var Vector = (function () {
        function Vector(type) {
            this.items = [];
            this._type = type;
        }
        Object.defineProperty(Vector.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "length", {
            get: function () {
                return this.items.length;
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.map = function (callback) {
            var length = this.length;
            var mapped = new Vector(this.type);
            for (var i = 0; i < length; i++) {
                mapped.items.push(callback(this.items[i], i, this));
            }
            return mapped;
        };
        return Vector;
    })();
    util.Vector = Vector;
})(util || (util = {}));
///<reference path="Collection.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var util;
(function (util) {
    var Vector = util.Vector;
    var Externalizable = (function () {
        function Externalizable() {
        }
        Externalizable.prototype.serialize = function (withObject) {
            if (withObject == null) {
                return null;
            }
            var keys = Object.keys(this);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                if (this[name] instanceof Externalizable) {
                    this[name].serialize(withObject[name]);
                }
                else if (name in withObject) {
                    // map an array of complex items with vector with serializable items
                    if (this[name] instanceof Vector) {
                        var length = withObject[name].length;
                        var vectorType = this[name].type;
                        var vector = this[name];
                        for (var i = 0; i < length; i++) {
                            vector.items[i] = new vectorType();
                            if (vector.items[i] instanceof Externalizable) {
                                vector.items[i].serialize(withObject[name][i]);
                            }
                            else {
                                vector.items[i] = withObject[name][i];
                            }
                        }
                    }
                    else
                        this[name] = withObject[name];
                }
            }
            return this;
        };
        return Externalizable;
    })();
    util.Externalizable = Externalizable;
})(util || (util = {}));
///<reference path="../util/Externalizable.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var snake;
(function (snake) {
    var Externalizable = util.Externalizable;
    var SnakeSettings = (function (_super) {
        __extends(SnakeSettings, _super);
        function SnakeSettings() {
            _super.apply(this, arguments);
            this.rows = 30;
            this.columns = 30;
            this.speed = 100;
        }
        return SnakeSettings;
    })(Externalizable);
    snake.SnakeSettings = SnakeSettings;
})(snake || (snake = {}));
///<reference path="SnakeSettings.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var snake;
(function (snake) {
    var Proxy = puremvc.Proxy;
    var Point = PIXI.Point;
    var SnakeDirection;
    (function (SnakeDirection) {
        SnakeDirection[SnakeDirection["left"] = 0] = "left";
        SnakeDirection[SnakeDirection["right"] = 1] = "right";
        SnakeDirection[SnakeDirection["up"] = 2] = "up";
        SnakeDirection[SnakeDirection["down"] = 3] = "down";
    })(SnakeDirection || (SnakeDirection = {}));
    var SnakeProxy = (function (_super) {
        __extends(SnakeProxy, _super);
        function SnakeProxy() {
            _super.call(this, SnakeProxy.NAME);
            this.direction = SnakeDirection.down;
            this.snake = [
                new Point(0, 0)
            ];
            // this flag guaranties that you can change the direction between two timer ticks only once
            this.direction_flag = true;
            this.score = 0;
            this.settings = new snake.SnakeSettings();
        }
        SnakeProxy.prototype.onRegister = function () {
            var appProxy = this.facade().retrieveProxy(snake.AppProxy.NAME);
            this.settings.serialize(appProxy.content.snake);
            var that = this;
            document.onkeydown = function (event) {
                if (!that.direction_flag)
                    return;
                var keyCode = event.keyCode;
                switch (keyCode) {
                    case 37:
                        if (that.direction != SnakeDirection.right) {
                            that.direction = SnakeDirection.left;
                        }
                        break;
                    case 39:
                        if (that.direction != SnakeDirection.left) {
                            that.direction = SnakeDirection.right;
                        }
                        break;
                    case 38:
                        if (that.direction != SnakeDirection.down) {
                            that.direction = SnakeDirection.up;
                        }
                        break;
                    case 40:
                        if (that.direction != SnakeDirection.up) {
                            that.direction = SnakeDirection.down;
                        }
                        break;
                }
                that.direction_flag = false;
                event.preventDefault();
                console.log('direction: ' + that.direction);
            };
        };
        SnakeProxy.prototype.start = function () {
            this.createFood();
            var that = this;
            this.timer_id = setInterval(function () {
                that.update();
            }, this.settings.speed);
            this.onUpdate.call(this);
        };
        SnakeProxy.prototype.update = function () {
            var x = this.snake[0].x;
            var y = this.snake[0].y;
            if (this.direction == SnakeDirection.right) {
                x++;
            }
            else if (this.direction == SnakeDirection.left) {
                x--;
            }
            else if (this.direction == SnakeDirection.up) {
                y--;
            }
            else if (this.direction == SnakeDirection.down) {
                y++;
            }
            if (x == -1 || x == this.settings.columns || y == -1 || y == this.settings.rows || this.collisionCheck(new Point(x, y))) {
                this.stop();
                this.onGameOver.call(this);
                return;
            }
            this.direction_flag = true;
            if (x == this.food.x && y == this.food.y) {
                var tail = new Point(x, y);
                this.score++;
                this.createFood();
            }
            else {
                tail = this.snake.pop();
                tail.x = x;
                tail.y = y;
            }
            this.snake.unshift(tail);
            this.onUpdate.call(this);
        };
        SnakeProxy.prototype.stop = function () {
            clearInterval(this.timer_id);
        };
        SnakeProxy.prototype.collisionCheck = function (point) {
            var length = this.snake.length;
            for (var i = 0; i < length; i++) {
                if (this.snake[i].equals(point)) {
                    return true;
                }
            }
            return false;
        };
        SnakeProxy.prototype.createFood = function () {
            //TODO: think of an algorithm on how to choose the food position
            this.food = new Point(Math.floor(Math.random() * this.settings.columns), Math.floor(Math.random() * this.settings.rows));
            if (this.collisionCheck(this.food)) {
                this.food = new Point(Math.floor(Math.random() * this.settings.columns), Math.floor(Math.random() * this.settings.rows));
            }
        };
        SnakeProxy.NAME = 'SnakeProxy';
        return SnakeProxy;
    })(Proxy);
    snake.SnakeProxy = SnakeProxy;
})(snake || (snake = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var snake;
(function (snake) {
    var Proxy = puremvc.Proxy;
    var AppProxy = (function (_super) {
        __extends(AppProxy, _super);
        function AppProxy() {
            _super.call(this, AppProxy.NAME);
        }
        AppProxy.prototype.onRegister = function () {
            this.load();
        };
        AppProxy.prototype.load = function () {
            var that = this;
            var semaphore = 2;
            // load atlas
            var loader = new PIXI.loaders.Loader();
            var url = this.libraryPath();
            loader.add(url);
            loader.load(function () {
                that._atlas = loader.resources[url].textures;
                semaphore--;
                if (semaphore == 0) {
                    that.onLoad.call(this);
                }
            });
            // load central content for the app
            $.ajax({
                cache: true,
                dataType: 'json',
                url: this.contentUrl(),
                contentType: 'application/json; charset=utf-8',
                crossDomain: false,
                success: function (data) {
                    that._content = data;
                    semaphore--;
                    if (semaphore == 0) {
                        that.onLoad.call(this);
                    }
                }
            });
        };
        AppProxy.prototype.libraryPath = function () {
            return '../assets/library.json?version=' + VERSION;
        };
        AppProxy.prototype.contentUrl = function () {
            return '../assets/content.json?version=' + VERSION;
        };
        AppProxy.prototype.getTexture = function (name, ext) {
            if (ext === void 0) { ext = 'png'; }
            if (this._atlas == null)
                return null;
            return this._atlas[name + (ext ? ('.' + ext) : '')];
        };
        Object.defineProperty(AppProxy.prototype, "content", {
            get: function () {
                return this._content;
            },
            enumerable: true,
            configurable: true
        });
        AppProxy.NAME = 'AppProxy';
        return AppProxy;
    })(Proxy);
    snake.AppProxy = AppProxy;
})(snake || (snake = {}));
///<reference path="mediator/StageMediator.ts"/>
///<reference path="mediator/SnakeGridMediator.ts"/>
///<reference path="proxy/SnakeProxy.ts"/>
///<reference path="proxy/AppProxy.ts"/>
var snake;
(function (snake) {
    var Facade = puremvc.Facade;
    var StageMediator = snake.StageMediator;
    var Main = (function () {
        function Main() {
            console.log('debug: ' + DEBUG);
            console.log('version: ' + VERSION);
            Facade.getInstance(Main.CORE_NAMESPACE).registerMediator(new StageMediator());
            Facade.getInstance(Main.CORE_NAMESPACE).registerProxy(new snake.SnakeProxy());
            Facade.getInstance(Main.CORE_NAMESPACE).registerMediator(new snake.SnakeGridMediator());
        }
        Main.CORE_NAMESPACE = 'snake';
        return Main;
    })();
    snake.Main = Main;
    function start(onComplete) {
        // load json with setting
        // on json loading completion create instance of main
        var appProxy = new snake.AppProxy();
        appProxy.onLoad = onComplete;
        Facade.getInstance(Main.CORE_NAMESPACE).registerProxy(appProxy);
    }
    snake.start = start;
})(snake || (snake = {}));
//# sourceMappingURL=snake.debug.js.map