import './styles.scss';
import React, { useState, useEffect, useContext } from 'react';
import { classNameBuilder } from 'als-services/className';
import { Button } from 'als-ui/controls';
import { db, dbFieldValue } from 'als-db-manager';
import ReactPaginate from 'react-paginate';

const cn = classNameBuilder('words-dict');
const wordsRef = db.collection('words');

type TLevel = 'hard' | 'norm' | 'easy';
type IWord = { [uid: string]: string };

const DISPLAY_COUNT = 25;

export const WordsDictPage: React.FC = () => {
    const [words, setWords] = useState<IWord>({});
    const [page, setPage] = useState(0);
    const [level, setLevel] = useState<TLevel | null>(null);
    const [disabled, setDisabled] = useState(false);

    const updateLevelDoc = (fromDoc: any, toDoc: any, uid: string) => {
        setDisabled(true);
        const batch = db.batch();
        batch.update(fromDoc, { [uid]: dbFieldValue.delete() });
        batch.update(toDoc, { [uid]: words[uid] });
        batch.commit().then(() => {
            delete words[uid];
            setWords(words);
            setDisabled(false);
        });
    };

    const handleLevel = (_level: TLevel) => {
        return () => {
            setDisabled(true);
            setLevel(_level);
            wordsRef
                .doc(_level)
                .get()
                .then(_docs => {
                    setPage(0);
                    setWords(_docs.data() as IWord);
                    setDisabled(false);
                });
        };
    };

    const handlePageClick = ({ selected }: { selected: number }) => {
        setPage(selected);
    };

    const changeLevelUp = (uid: string) => {
        return () => {
            if (level === 'easy') {
                updateLevelDoc(wordsRef.doc(level), wordsRef.doc('norm'), uid);
            } else if (level === 'norm') {
                updateLevelDoc(wordsRef.doc(level), wordsRef.doc('hard'), uid);
            } else if (level === 'hard') {
                updateLevelDoc(wordsRef.doc(level), wordsRef.doc('ignore'), uid);
            }
        };
    };

    const changeLevelDown = (uid: string) => {
        return () => {
            if (level === 'norm') {
                updateLevelDoc(wordsRef.doc(level), wordsRef.doc('easy'), uid);
            } else if (level === 'hard') {
                updateLevelDoc(wordsRef.doc(level), wordsRef.doc('norm'), uid);
            }
        };
    };
    const start = page * DISPLAY_COUNT;
    const end = (page + 1) * DISPLAY_COUNT;

    return (
        <div className={cn()}>
            <div className={cn('levels')}>
                <Button size="small" type="secondary" text="Легкие" onAction={handleLevel('easy')} />
                <Button size="small" type="secondary" text="Нормальные" onAction={handleLevel('norm')} />
                <Button size="small" type="secondary" text="Сложные" onAction={handleLevel('hard')} />
            </div>
            <ul>
                {level &&
                    Object.keys(words)
                        .slice(start, end)
                        .map(uid => (
                            <li key={uid} className={cn('item')}>
                                <span className={cn('word')}>{words[uid]}</span>
                                {['hard', 'norm'].includes(level) && (
                                    <Button
                                        className={cn('change-btn')}
                                        size="small"
                                        type="secondary"
                                        text="-"
                                        onAction={changeLevelDown(uid)}
                                    />
                                )}
                                {level === 'hard' && (
                                    <Button
                                        className={cn('change-btn')}
                                        size="small"
                                        type="secondary"
                                        text="X"
                                        onAction={changeLevelUp(uid)}
                                    />
                                )}
                                {['easy', 'norm'].includes(level) && (
                                    <Button
                                        className={cn('change-btn')}
                                        size="small"
                                        type="secondary"
                                        text="+"
                                        onAction={changeLevelUp(uid)}
                                    />
                                )}
                            </li>
                        ))}
            </ul>
            <ReactPaginate
                initialPage={page}
                previousLabel="<"
                nextLabel=">"
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Object.keys(words).length / DISPLAY_COUNT}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={cn('pagination')}
                activeClassName={cn('active')}
            />
            {disabled && <div className={cn('overlay')}></div>}
        </div>
    );
};
