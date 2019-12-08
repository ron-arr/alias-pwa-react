import { Style, spring } from 'react-motion';

export type TMotionStatus = 'ROLLBACK' | 'ACCEPT' | 'SKIP' | 'DRAG' | 'STOP';

const defaultConfig = { stiffness: 330, damping: 60, precision: 1 };

export const getMotionStyle = (status: TMotionStatus, x: number, y: number): Style => {
    let style: Style = {};

    if (status === 'DRAG') {
        style = {
            scale: spring(1.15, defaultConfig),
            shadow: spring(30, defaultConfig),
            opacity: 1,
            x: x,
            y: y,
        };
    } else if (status === 'ROLLBACK' || status === 'STOP') {
        style = {
            scale: spring(1, { stiffness: 400, damping: 10, precision: 0.1 }),
            shadow: spring(1, defaultConfig),
            opacity: 1,
            x: spring(0, defaultConfig),
            y: spring(0, defaultConfig),
        };
    } else if (status === 'ACCEPT' || status === 'SKIP') {
        y = y > 0 ? y + 300 : y - 300;
        style = {
            scale: spring(0.2, { stiffness: 600, damping: 50, precision: 0.1 }),
            opacity: spring(0, { stiffness: 200, damping: 30, precision: 0.1 }),
            shadow: spring(2, defaultConfig),
            x: spring(x, { stiffness: 400, damping: 50, precision: 0.1 }),
            y: spring(y, { stiffness: 400, damping: 50, precision: 0.1 }),
        };
    }
    return style;
};
