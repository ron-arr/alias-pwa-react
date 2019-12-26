import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import txt from 'alias-words/word_rus_shuffled.txt';
import { Button } from 'als-ui/controls';
import { db } from 'als-db-manager';
import { getRandomString } from 'als-services/utils';

let words: string[] = [];
const LIMIT = 10;

const cn = classNameBuilder('words');

const wordsRef = db.collection('words');
const lastNumDoc = db.collection('_settings').doc('lastNum');

let lastNum: number = 0;

// @ts-ignore
function count_words() {
    wordsRef
        .doc('easy')
        .get()
        .then(doc => console.log('easy', Object.keys(doc.data() as object).length));
    wordsRef
        .doc('norm')
        .get()
        .then(doc => console.log('norm', Object.keys(doc.data() as object).length));
    wordsRef
        .doc('hard')
        .get()
        .then(doc => console.log('hard', Object.keys(doc.data() as object).length));
    wordsRef
        .doc('ignore')
        .get()
        .then(doc => console.log('ignore', Object.keys(doc.data() as object).length));
}

export const WordsPage: React.FC = () => {
    const [loaded, setLoaded] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [num, setNum] = useState(0);

    if (!loaded) {
        lastNumDoc.get().then(doc => {
            if (doc.exists) {
                const data = doc.data() as { value: number };
                lastNum = data.value;
            } else {
                lastNum = 0;
            }
            words = txt.split('\n', lastNum + LIMIT);
            words = words.slice(lastNum, lastNum + LIMIT);
            setLoaded(true);
            setNum(0);
        });
    }
    const addTo = (level: 'easy' | 'norm' | 'hard' | 'ignore') => {
        return () => {
            setDisabled(true);
            const batch = db.batch();
            batch.set(lastNumDoc, { value: lastNum + num + 1 });
            batch.update(wordsRef.doc(level), { [getRandomString()]: words[num].trim() });
            batch.commit().then(() => {
                setNum(num + 1);
                setDisabled(false);
            });
        };
    };

    if (!loaded) {
        return null;
    }

    const word = words[num];
    if (!word) {
        setLoaded(false);
        return null;
    }

    return (
        <div className={cn()}>
            <div className={cn('word')}>{words[num]}</div>

            <div className={cn('btn')}>
                <Button disabled={disabled} type="secondary" text="Это элементарно" onAction={addTo('easy')} />
            </div>
            <div className={cn('help')}>Не самая очевидная форма слова</div>
            <div className={cn('btn')}>
                <Button disabled={disabled} type="secondary" text="Ну пойдет" onAction={addTo('norm')} />
            </div>
            <div className={cn('help')}>Сложносочиненное или сложносоставное или редковстречаемое</div>
            <div className={cn('btn')}>
                <Button disabled={disabled} type="secondary" text="Трууудно" onAction={addTo('hard')} />
            </div>
            <div className={cn('help')}>Если слово совсем не знакомо или узкоспециализировано</div>
            <div className={cn('btn')}>
                <Button disabled={disabled} type="secondary" text="Че такое" onAction={addTo('ignore')} />
            </div>
        </div>
    );
};
