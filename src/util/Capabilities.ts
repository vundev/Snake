///<reference path="GlobalFunctions.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module util {
    export enum EVENT_TYPE {
        CLICK,
        MOVE,
        DOWN,
        UP,
        OVER,
        OUT
    }

    export class Capabilities {
        constructor() {
            throw new Error('static class')
        }

        public static get scaleFactor(): number {
            if (window.devicePixelRatio < 2) return 1
            else if (window.devicePixelRatio < 3) return 2
            return 3
        }

        public static eventType(type: number): string {
            switch (type) {
                case EVENT_TYPE.CLICK:
                    return isMobile() ? 'tap' : 'click'
                case EVENT_TYPE.MOVE:
                    return isMobile() ? 'touchmove' : 'mousemove'
                case EVENT_TYPE.DOWN:
                    return isMobile() ? 'touchstart' : 'mousedown'
                case EVENT_TYPE.UP:
                    return isMobile() ? 'touchend' : 'mouseup'
                case EVENT_TYPE.OVER:
                    return isMobile() ? 'pointerover' : 'mouseover'
                case EVENT_TYPE.OUT:
                    return isMobile() ? 'touchendoutside' : 'mouseout'
            }
            return null
        }

        public static isPrimaryTouchPoint(event): boolean {
            if (isMobile()) {
                const touches: Array<any> = event.data.originalEvent.touches
                return touches.length == 0 ? true : event.data.identifier == touches[0].identifier
            }
            return true
        }
    }
}