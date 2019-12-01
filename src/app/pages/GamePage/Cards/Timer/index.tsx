import './styles.scss';
import React, { useState, useEffect, useRef, memo } from 'react';
import { classNameBuilder } from 'als-services/className';

interface IState {
    status: 'sec' | 'ms' | 'stop' | 'sendAlert';
    seconds: number;
    miliseconds: number;
    delay: number | null;
}

interface IProps {
    totalSeconds: number;
    msStartAt: number;
    className?: string;
    onAlert: () => void;
}

type TCallback = () => void;

function useInterval(callback: TCallback, delay: number | null) {
    const savedCallback = useRef<TCallback>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            (savedCallback.current as TCallback)();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
        return;
    }, [delay]);
}

const cn = classNameBuilder('timer');

const Timer: React.FunctionComponent<IProps> = ({ totalSeconds, msStartAt, className, onAlert }) => {
    const [state, setState] = useState<IState>({
        status: 'sec',
        delay: 1000,
        seconds: totalSeconds,
        miliseconds: 0,
    });

    const { seconds, miliseconds, status, delay } = state;
    useInterval(() => {
        if (status === 'sec') {
            const updates = { ...state, seconds: seconds - 1 };
            if (updates.seconds === msStartAt) {
                updates.status = 'ms';
                updates.delay = 100;
            }
            if (updates.seconds === 0) {
                updates.status = 'stop';
            }
            setState(updates);
        } else if (status === 'ms') {
            const updates = { ...state, miliseconds: miliseconds + 1 };
            if (!(updates.miliseconds % 10)) {
                updates.seconds -= 1;
                updates.miliseconds = 0;
            }
            if (updates.seconds === 0) {
                updates.status = 'stop';
                updates.delay = null;
            }
            setState(updates);
        }
    }, delay);

    if (status === 'stop') {
        setState({ ...state, status: 'sendAlert' });
    } else if (status === 'sendAlert') {
        onAlert();
    }

    const minutesDisplay = Math.floor(seconds / 60);
    const secondsDisplay = seconds - minutesDisplay * 60;

    return (
        <div className={cn('', [className])}>
            <div className={cn('hour')}>{minutesDisplay.toString()}</div>
            <div className={cn('seconds')}>{secondsDisplay > 9 ? secondsDisplay.toString() : `0${secondsDisplay}`}</div>
            {status === 'ms' && <div className={cn('miliseconds')}>{miliseconds}</div>}
        </div>
    );
};

const memoTimer = memo(Timer);
export { memoTimer as Timer };
