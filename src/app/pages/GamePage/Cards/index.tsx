import './styles.scss';
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { classNameBuilder } from 'als-services/className';
import { Motion } from 'react-motion';
import { Timer } from './Timer';
import { TMotionStatus, getMotionStyle } from './motionStyles';
import { Result } from 'als-models';

interface IProps {
    gameUid: string;
    words: string[];
    onFinish: (result: Result) => void;
}

interface IState {
    finishReadiness: 'not' | 'ready' | 'already';
    result: Result;
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

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

export const Cards: React.FC<IProps> = ({ gameUid, words, onFinish }: IProps) => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const acceptRef = useRef<HTMLDivElement>(null);
    const skipRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<IState>({
        finishReadiness: 'not',
        result: new Result(gameUid),
        mouseY: 0,
        mouseX: 0,
        topDeltaY: 0,
        leftDeltaX: 0,
        index: 0,
        motionStatus: 'CANCEL',
        topBound: windowDimensions.height / 2,
        bottomBound: windowDimensions.height / 2,
    });
    const { index, mouseY, mouseX, topDeltaY, leftDeltaX, motionStatus, topBound, bottomBound, result, finishReadiness } = state;

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
            onFinish(result);
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

    const handleAcceptSkip = (motionStatus: TMotionStatus) => {
        setState({
            ...state,
            index: index + 1,
            motionStatus,
            mouseY: Number(motionStatus === 'SKIP'),
        });
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
            result.add({
                num: index + 1,
                guess: motionStatus === 'ACCEPT',
                word: words[index],
            });
            setState({ ...state, motionStatus: 'CANCEL', index: index + 1, result });
        }
    };

    const handleAlert = useCallback(() => {
        setState({ ...state, finishReadiness: 'ready' });
    }, []);

    const word = words[index];
    const style = getMotionStyle(motionStatus, mouseX, mouseY);

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
                <button className={cn('btn-title', { accept: true })} onClick={() => handleAcceptSkip('ACCEPT')}>
                    Верно
                </button>
            </div>
            <div className={cn('skip')} ref={skipRef}>
                <button className={cn('btn-title', { skip: true })} onClick={() => handleAcceptSkip('SKIP')}>
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
