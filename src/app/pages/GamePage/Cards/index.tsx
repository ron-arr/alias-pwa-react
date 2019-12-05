import './styles.scss';
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, memo } from 'react';
import { classNameBuilder } from 'als-services/className';
import { Motion } from 'react-motion';
import { Timer } from './Timer';
import { TMotionStatus, getMotionStyle } from './motionStyles';
import { Result } from 'als-models';
import { useTopBottomBounds } from 'als-hooks';

interface IProps {
    gameUid: string;
    words: string[];
    time: number;
    onFinish: (result: Result) => void;
}

interface IState {
    result: Result;
    mouseY: number;
    mouseX: number;
    topDeltaY: number;
    leftDeltaX: number;
    index: number;
    motionStatus: TMotionStatus;
}
const cn = classNameBuilder('cards');

const Cards: React.FC<IProps> = ({ gameUid, words, time, onFinish }: IProps) => {
    const [state, setState] = useState<IState>({
        result: new Result(gameUid),
        mouseY: 0,
        mouseX: 0,
        topDeltaY: 0,
        leftDeltaX: 0,
        index: 0,
        motionStatus: 'ROLLBACK',
    });
    const { index, mouseY, mouseX, topDeltaY, leftDeltaX, motionStatus, result } = state;
    const acceptRef = useRef<HTMLDivElement>(null);
    const skipRef = useRef<HTMLDivElement>(null);
    const { top, bottom } = useTopBottomBounds(acceptRef, skipRef);

    useEffect(() => {
        if (motionStatus === 'ACCEPT' || motionStatus === 'SKIP') {
            setTimeout(() => {
                handleRelease(index);
            }, 300);
        }
        if (motionStatus === 'STOP') {
            // Остановка игры
            result.add({
                status: 'LAST',
                word: words[index],
            });
            onFinish(result);
        }
    }, [motionStatus]);

    const handleDrag = useCallback(
        (pressX: number, pressY: number, pageX: number, pageY: number) => {
            if (motionStatus === 'ROLLBACK') {
                setState(prevState => {
                    if (prevState.motionStatus !== 'STOP') {
                        return {
                            ...state,
                            topDeltaY: pageY - pressY,
                            leftDeltaX: pageX - pressX,
                            mouseY: pressY,
                            mouseX: pressX,
                            motionStatus: 'DRAG',
                        };
                    }
                    return prevState;
                });
            }
        },
        [motionStatus]
    );

    const handleMouseDown = (pressY: number, pressX: number, { pageY, pageX }: React.MouseEvent) => {
        handleDrag(pressX, pressY, pageX, pageY);
    };
    const handleTouchStart = (pressY: number, pressX: number, { touches }: React.TouchEvent<HTMLDivElement>) => {
        const { pageY, pageX } = touches[0];
        handleDrag(pressX, pressY, pageX, pageY);
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        event.preventDefault();
        handleMove(event.touches[0].pageY, event.touches[0].pageX);
    };

    const handleDrop = () => {
        let newMotionStatus: TMotionStatus = 'ROLLBACK';

        if (mouseY < 0) {
            if (top > topDeltaY + mouseY) {
                newMotionStatus = 'ACCEPT';
            }
        }
        if (mouseY > 0) {
            if (bottom < topDeltaY + mouseY) {
                newMotionStatus = 'SKIP';
            }
        }
        setState(prevState => {
            if (prevState.motionStatus !== 'STOP') {
                return {
                    ...prevState,
                    motionStatus: newMotionStatus,
                    topDeltaY: 0,
                };
            }
            return prevState;
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

    const handleAcceptSkip = useCallback(
        (_motionStatus: TMotionStatus) => {
            if (motionStatus === 'ROLLBACK') {
                setState({
                    ...state,
                    motionStatus: _motionStatus,
                    mouseY: Number(_motionStatus === 'SKIP'),
                });
            }
        },
        [motionStatus]
    );

    const handleRelease = (_index: number) => {
        if (motionStatus === 'ACCEPT' || motionStatus === 'SKIP') {
            result.add({
                status: motionStatus === 'ACCEPT' ? 'ACCEPTED' : 'SKIPPED',
                word: words[_index],
            });
            setState(prevState => {
                if (prevState.motionStatus !== 'STOP') {
                    return { ...prevState, motionStatus: 'ROLLBACK', index: _index + 1, result };
                }
                return prevState;
            });
        }
    };

    const handleAlert = useCallback(() => {
        setState(prevState => ({ ...prevState, motionStatus: 'STOP' }));
    }, []);

    const word = words[index] || '';
    const style = getMotionStyle(motionStatus, mouseX, mouseY);

    return (
        <div
            className={cn('', {
                drag: motionStatus === 'DRAG',
                'drag-up': motionStatus === 'DRAG' && top > mouseY + topDeltaY,
                'drag-down': motionStatus === 'DRAG' && bottom < mouseY + topDeltaY,
            })}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={handleMouseUp}
        >
            {motionStatus !== 'STOP' && (
                <>
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
                </>
            )}
            <div className={cn('wrapper')}>
                <Timer className={cn('timer')} totalSeconds={time} msStartAt={10} onAlert={handleAlert} />
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

const memoCards = memo(Cards);
export { memoCards as Cards };
