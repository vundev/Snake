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
    import TilingSprite = PIXI.extras.TilingSprite;
    import Texture = PIXI.Texture;
    import Sprite = PIXI.Sprite;
    import Container = PIXI.Container;
    export class SnakeGridOptimized extends Holder {
        columns: number
        rows: number
        grid: TilingSprite
        snakeAndFood: Container = new Container()
        cellIdle: Texture
        cellSelected: Texture

        constructor(rows: number, columns: number, design?) {
            super()

            design = design || {}

            this.rows = rows
            this.columns = columns

            if (design.cellIdle instanceof Texture && design.cellSelected instanceof Texture) {
                this.cellIdle = design.cellIdle as Texture;
                this.cellSelected = design.cellSelected as Texture;

                this.grid = new TilingSprite(design.cellIdle, columns * this.cellIdle.width, rows * this.cellIdle.height)
                this.addChild(this.grid)
                this.addChild(this.snakeAndFood)
            }
        }

        update(snake: Array<Point>, food: Point) {
            this.snakeAndFood.removeChildren()
            snake = snake.concat(food)
            const length: number = snake.length
            for (var i = 0; i < length; i++) {
                var cell: Sprite = new Sprite(this.cellSelected)
                this.snakeAndFood.addChild(cell)
                cell.x = snake[i].x * cell.width
                cell.y = snake[i].y * cell.height
            }
        }
    }
}