///<reference path="SnakeSettings.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace snake {
    import Proxy = puremvc.Proxy;
    import Point = PIXI.Point;

    enum SnakeDirection{
        left,
        right,
        up,
        down
    }

    export class SnakeProxy extends Proxy {
        public static NAME: string = 'SnakeProxy'
        direction: SnakeDirection = SnakeDirection.down
        snake: Array<Point> = [
            new Point(0, 0)
        ]
        private timer_id: number
        // this flag guaranties that you can change the direction between two timer ticks only once
        direction_flag: boolean = true
        food: Point
        score: number = 0
        // MARK: Delegate
        onUpdate: () => void
        onGameOver: () => void
        settings: SnakeSettings = new SnakeSettings()

        constructor() {
            super(SnakeProxy.NAME)
        }

        onRegister(): void {
            const appProxy = this.facade().retrieveProxy(AppProxy.NAME) as AppProxy;
            this.settings.serialize(appProxy.content.snake)

            const that = this
            document.onkeydown = function (event) {
                if (!that.direction_flag) return
                const keyCode: number = event.keyCode;

                switch (keyCode) {
                    case 37:
                        if (that.direction != SnakeDirection.right) {
                            that.direction = SnakeDirection.left;
                        }
                        break
                    case 39:
                        if (that.direction != SnakeDirection.left) {
                            that.direction = SnakeDirection.right;
                        }
                        break
                    case 38:
                        if (that.direction != SnakeDirection.down) {
                            that.direction = SnakeDirection.up;
                        }
                        break
                    case 40:
                        if (that.direction != SnakeDirection.up) {
                            that.direction = SnakeDirection.down;
                        }
                        break
                }

                that.direction_flag = false

                event.preventDefault()
                console.log('direction: ' + that.direction)
            }
        }

        start() {
            this.createFood()
            const that = this
            this.timer_id = setInterval(function () {
                that.update()
            }, this.settings.speed)
            this.onUpdate.call(this)
        }

        update() {
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
            } else if (this.direction == SnakeDirection.down) {
                y++;
            }

            if (x == -1 || x == this.settings.columns || y == -1 || y == this.settings.rows || this.collisionCheck(new Point(x, y))) {
                this.stop()
                this.onGameOver.call(this)
                return;
            }

            this.direction_flag = true

            if (x == this.food.x && y == this.food.y) {
                var tail = new Point(x, y)
                this.score++
                this.createFood();
            } else {
                tail = this.snake.pop();
                tail.x = x;
                tail.y = y;
            }
            this.snake.unshift(tail);

            this.onUpdate.call(this)
        }

        stop() {
            clearInterval(this.timer_id)
        }

        private collisionCheck(point: Point): boolean {
            const length: number = this.snake.length
            for (var i = 0; i < length; i++) {
                if (this.snake[i].equals(point)) {
                    return true
                }
            }
            return false
        }

        private createFood() {
            //TODO: think of an algorithm on how to choose the food position
            this.food = new Point(Math.floor(Math.random() * this.settings.columns), Math.floor(Math.random() * this.settings.rows))
            if (this.collisionCheck(this.food)) {
                this.food = new Point(Math.floor(Math.random() * this.settings.columns), Math.floor(Math.random() * this.settings.rows))
            }
        }
    }
}