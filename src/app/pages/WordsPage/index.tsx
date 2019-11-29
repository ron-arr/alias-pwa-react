import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import txt from 'alias-words/word_rus_shuffled.txt';
import { Button } from 'als-ui/controls';
import { db } from 'als-db-manager';

let words: string[] = [];
const LIMIT = 10;

const cn = classNameBuilder('words');

const wordsEasyRef = db.collection('wordsEasy');
const wordsNormRef = db.collection('wordsNorm');
const wordsHardRef = db.collection('wordsHard');
const wordsIgnoreRef = db.collection('wordsIgnore');
const settingsRef = db.collection('_settings');
const lastNumDoc = settingsRef.doc('lastNum');

let lastNum: number = 0;

// @ts-ignore
function count_words() {
    wordsEasyRef.get().then(snap => console.log('wordsEasyRef', snap.size));
    wordsNormRef.get().then(snap => console.log('wordsNormRef', snap.size));
    wordsHardRef.get().then(snap => console.log('wordsHardRef', snap.size));
    wordsIgnoreRef.get().then(snap => console.log('wordsIgnoreRef', snap.size));
}

export const WordsPage: React.FC = () => {
    const [loaded, setLoaded] = useState(false);
    const [disabled, setDisabled] = useState(false);

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
    const [num, setNum] = useState(0);
    const addToEasy = () => {
        setDisabled(true);
        lastNumDoc.set({ value: lastNum + num + 1 }).then(() => {
            wordsEasyRef.add({
                value: words[num],
                num: num,
            });
            setNum(num + 1);
            setDisabled(false);
        });
    };
    const addToNorm = () => {
        setDisabled(true);
        lastNumDoc.set({ value: lastNum + num + 1 }).then(() => {
            wordsNormRef.add({
                value: words[num],
                num: num,
            });
            setNum(num + 1);
            setDisabled(false);
        });
    };
    const addToHard = () => {
        setDisabled(true);
        lastNumDoc.set({ value: lastNum + num + 1 }).then(() => {
            wordsHardRef.add({
                value: words[num],
                num: num,
            });
            setNum(num + 1);
            setDisabled(false);
        });
    };
    const addToIgnore = () => {
        setDisabled(true);
        lastNumDoc.set({ value: lastNum + num + 1 }).then(() => {
            wordsIgnoreRef.add({
                value: words[num],
                num: num,
            });
            setNum(num + 1);
            setDisabled(false);
        });
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
                <Button disabled={disabled} type="secondary" text="Это элементарно" onAction={addToEasy} />
            </div>
            <div className={cn('help')}>Не самая очевидная форма слова</div>
            <div className={cn('btn')}>
                <Button disabled={disabled} type="secondary" text="Ну пойдет" onAction={addToNorm} />
            </div>
            <div className={cn('help')}>Сложносочиненное или сложносоставное или редковстречаемое</div>
            <div className={cn('btn')}>
                <Button disabled={disabled} type="secondary" text="Трууудно" onAction={addToHard} />
            </div>
            <div className={cn('help')}>Если слово совсем не знакомо или узкоспециализировано</div>
            <div className={cn('btn')}>
                <Button disabled={disabled} type="secondary" text="Че такое" onAction={addToIgnore} />
            </div>
        </div>
    );
};
