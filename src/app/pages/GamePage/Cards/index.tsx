import './styles.scss';
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { classNameBuilder } from 'als-services/className';
import { Motion, spring, Style } from 'react-motion';
import { Timer } from './Timer';

export type TResult = { num: number; guess: boolean; word: string };
type TMotionStatus = 'CANCEL' | 'ACCEPT' | 'SKIP' | 'DRAG';

interface IProps {
    words: string[];
    onFinish: (results: TResult[]) => void;
}

interface IState {
    finishReadiness: 'not' | 'ready' | 'already';
    results: TResult[];
    mouseY: number;
    mouseX: number;
    topDeltaY: number;
    leftDeltaX: number;
    index: number;
    topBound: number;
    bottomBound: number;
    motionStatus: TMotionStatus;
}
const cn = classNameBuilder('cards');
const springConfig = { stiffness: 330, damping: 60 };

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

export const Cards: React.FC<IProps> = ({ words, onFinish }: IProps) => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const acceptRef = useRef<HTMLDivElement>(null);
    const skipRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<IState>({
        finishReadiness: 'not',
        results: [],
        mouseY: 0,
        mouseX: 0,
        topDeltaY: 0,
        leftDeltaX: 0,
        index: 0,
        motionStatus: 'CANCEL',
        topBound: windowDimensions.height / 2,
        bottomBound: windowDimensions.height / 2,
    });
    const { index, mouseY, mouseX, topDeltaY, leftDeltaX, motionStatus, topBound, bottomBound, results, finishReadiness } = state;

    useLayoutEffect(() => {
        if (acceptRef.current && skipRef.current) {
            const { height } = acceptRef.current.getBoundingClientRect();
            const { top } = skipRef.current.getBoundingClientRect();
            setState({ ...state, topBound: height, bottomBound: top });
        }
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);

    useEffect(() => {
        if (motionStatus === 'ACCEPT' || motionStatus === 'SKIP') {
            setTimeout(() => {
                handleRelease(index);
            }, 300);
        }
        if (motionStatus == 'CANCEL' && finishReadiness === 'ready') {
            onFinish(results);
            setState({ ...state, finishReadiness: 'already' });
        }
    }, [motionStatus, finishReadiness]);

    const handleTouchMove = (event: React.TouchEvent) => {
        event.preventDefault();
        handleMove(event.touches[0].pageY, event.touches[0].pageX);
    };

    const handleDrop = () => {
        let newMotionStatus: TMotionStatus = 'CANCEL';

        if (mouseY < 0) {
            if (topBound > topDeltaY + mouseY) {
                newMotionStatus = 'ACCEPT';
            }
        }
        if (mouseY > 0) {
            if (bottomBound < topDeltaY + mouseY) {
                newMotionStatus = 'SKIP';
            }
        }
        setState({
            ...state,
            motionStatus: newMotionStatus,
            topDeltaY: 0,
        });
    };
    const handleMouseUp = ({ pageY, pageX }: React.MouseEvent) => {
        if (motionStatus === 'DRAG') {
            handleDrop();
        }
    };
    const handleTouchUp = ({ touches }: React.TouchEvent) => {
        if (motionStatus === 'DRAG') {
            handleDrop();
        }
    };
    const handleMove = (pageY: number, pageX: number) => {
        if (motionStatus === 'DRAG') {
            const mouseY = pageY - topDeltaY;
            const mouseX = pageX - leftDeltaX;
            setState({ ...state, mouseY, mouseX });
        }
    };
    const handleMouseMove = ({ pageY, pageX }: React.MouseEvent) => {
        handleMove(pageY, pageX);
    };

    const handleAcceptSkip = (guess: boolean) => {
        results.push({
            num: index + 1,
            guess: guess,
            word: words[index],
        });
        setState({ ...state, index: index + 1, results });
    };

    const handleDrag = (pressX: number, pressY: number, pageX: number, pageY: number) => {
        setState({
            ...state,
            topDeltaY: pageY - pressY,
            leftDeltaX: pageX - pressX,
            mouseY: pressY,
            mouseX: pressX,
            motionStatus: 'DRAG',
        });
    };
    const handleMouseDown = (pressY: number, pressX: number, { pageY, pageX }: React.MouseEvent) => {
        handleDrag(pressX, pressY, pageX, pageY);
    };
    const handleTouchStart = (pressY: number, pressX: number, { touches }: React.TouchEvent<HTMLDivElement>) => {
        const { pageY, pageX } = touches[0];
        handleDrag(pressX, pressY, pageX, pageY);
    };

    const handleRelease = (index: number) => {
        if (motionStatus === 'ACCEPT' || motionStatus === 'SKIP') {
            results.push({
                num: index + 1,
                guess: motionStatus === 'ACCEPT',
                word: words[index],
            });
            setState({ ...state, motionStatus: 'CANCEL', index: index + 1, results });
        }
    };

    const handleAlert = useCallback(() => {
        console.log('handleAlert');
        setState({ ...state, finishReadiness: 'ready' });
    }, []);

    const word = words[index];
    let style: Style = {};

    if (motionStatus === 'DRAG') {
        style = {
            scale: spring(1.15, springConfig),
            shadow: spring(30, springConfig),
            opacity: 1,
            x: mouseX,
            y: mouseY,
        };
    } else if (motionStatus === 'CANCEL') {
        style = {
            scale: spring(1, { stiffness: 400, damping: 10, precision: 10 }),
            shadow: spring(1, springConfig),
            opacity: 1,
            x: spring(0, springConfig),
            y: spring(0, springConfig),
        };
    } else if (motionStatus === 'ACCEPT' || motionStatus === 'SKIP') {
        style = {
            scale: spring(0.2, { stiffness: 400, damping: 50, precision: 0.1 }),
            opacity: spring(0, { stiffness: 400, damping: 30, precision: 0.1 }),
            shadow: spring(2, springConfig),
            x: spring(mouseX, springConfig),
            y: spring(mouseY, springConfig),
        };
    }
    return (
        <div
            className={cn('', {
                drag: motionStatus === 'DRAG',
                'drag-up': motionStatus === 'DRAG' && topBound > mouseY + topDeltaY,
                'drag-down': motionStatus === 'DRAG' && bottomBound < mouseY + topDeltaY,
            })}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={handleMouseUp}
        >
            <div className={cn('accept')} ref={acceptRef}>
                <button className={cn('btn-title', { accept: true })} onClick={() => handleAcceptSkip(true)}>
                    Верно
                </button>
            </div>
            <div className={cn('skip')} ref={skipRef}>
                <button className={cn('btn-title', { skip: true })} onClick={() => handleAcceptSkip(false)}>
                    Пропустить
                </button>
            </div>
            <div className={cn('wrapper')}>
                <Timer className={cn('timer')} totalSeconds={6} msStartAt={5} onAlert={handleAlert} />
                <Motion style={style}>
                    {({ scale, shadow, opacity, x, y }) => (
                        <div
                            onMouseDown={handleMouseDown.bind(null, y, x)}
                            onTouchStart={handleTouchStart.bind(null, y, x)}
                            onTouchEnd={handleTouchUp}
                            className={cn('word', { tldr: word.length > 14 })}
                            style={{
                                opacity: opacity,
                                boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                                WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                            }}
                        >
                            {word}
                        </div>
                    )}
                </Motion>
            </div>
        </div>
    );
};
