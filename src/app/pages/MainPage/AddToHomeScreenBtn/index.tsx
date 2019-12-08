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
    const [show, setShow] = useState(false);
    const [deffered, setDeffered] = useState<BeforeInstallPromptEvent | null>(null);
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault();
            setDeffered(e as BeforeInstallPromptEvent);
            setShow(true);
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
    const handleCancel = () => {
        setShow(false);
    };
    if (window.matchMedia('display-mode: standalone').matches || !show) {
        return null;
    }
    return (
        <div className={cn()}>
            <button onClick={handleCancel} className={cn('cancel')}>
                Отмена
            </button>
            <button onClick={handleInstall} className={cn('btn')}>
                Добавить приложение на рабочий стол
            </button>
        </div>
    );
};
