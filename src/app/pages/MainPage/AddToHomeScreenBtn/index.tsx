import './styles.scss';
import React, { useState, useEffect } from 'react';
import { classNameBuilder } from 'als-services/className';
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

const cn = classNameBuilder('add-2hs');

export const AddToHomeScreenBtn: React.FC = () => {
    const [deffered, setDeffered] = useState<BeforeInstallPromptEvent | null>(null);
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', e => {
            console.log('e', e);
            e.preventDefault();
            setDeffered(e as BeforeInstallPromptEvent);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', e => {
                return;
            });
        };
    }, []);

    const handleInstall = () => {
        if (deffered) {
            deffered.prompt();
            deffered.userChoice.then(choice => {
                if (choice.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                setDeffered(null);
            });
        }
    };
    if (!deffered || window.matchMedia('display-mode: standalone').matches) {
        return null;
    }
    return (
        <button onClick={handleInstall} className={cn('')}>
            <span className={cn('text')}>Добавить приложение</span> <span className={cn('text')}>на домашний экран</span>
        </button>
    );
};
