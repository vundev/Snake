///<reference path="../layout/Holder.ts"/>
///<reference path="../layout/Button.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace snake {
    import Holder = layout.Holder;
    import Button = layout.Button;
    import Point = PIXI.Point;
    import SpriteSheet = layout.SpriteSheet;
    export class SnakeGrid extends Holder {
        columns: number
        rows: number
        private previous_snake: Array<Point> = []
        private previous_food: Point

        constructor(rows: number, columns: number, design?) {
            super()

            design = design || {}

            this.rows = rows
            this.columns = columns

            const padding: number = 2
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    let cell: Button = new Button(design.cellFrames ? new SpriteSheet(design.cellFrames) : null, {
                        supportedStates: {
                            selected: 0xff0000
                        },
                        label: false
                    })
                    this.addChild(cell)
                    // cell.label.text = String(this.columns * j + i);
                    cell.setState('idle')

                    cell.x = j * (cell.width + padding)
                    cell.y = i * (cell.height + padding)
                }
            }
        }

        private clear() {
            if (this.previous_snake.length > 0) {
                const length: number = this.previous_snake.length
                for (var i = 0; i < length; i++) {
                    this.getCell(this.previous_snake[i]).setState('idle');
                }
                if (this.previous_food) {
                    this.getCell(this.previous_food).setState('idle')
                }
            }
        }

        update(snake: Array<Point>, food: Point) {
            this.clear()

            const length: number = snake.length
            for (var i = 0; i < length; i++) {
                this.getCell(snake[i]).setState('selected');
            }
            this.getCell(food).setState('selected')

            this.previous_food = food
            this.previous_snake = this.clone(snake)
        }

        private clone(snake: Array<Point>): Array<Point> {
            const clone: Array<Point> = []
            const length: number = snake.length
            for (var i = 0; i < length; i++) {
                clone[i] = snake[i].clone()
            }
            return clone
        }

        private getCell(point: Point): Button {
            return this.children[this.columns * point.y + point.x] as Button;
        }
    }
}