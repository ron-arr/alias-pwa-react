import './styles.scss';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { classNameBuilder } from 'als-services/className';

interface IProps {
    gameUid: string;
}

const cn = classNameBuilder('share-link');

export const ShareLink: React.FC<IProps> = ({ gameUid }: IProps) => {
    const nav: any = window.navigator;
    const [isCopied, setCopied] = useState(false);
    const url = `${window.location.origin}/play/${gameUid}`;

    const handleShare = () => {
        if (nav.share) {
            nav.share({
                title: 'Alias',
                text: 'Играть вместе с друзьями',
                url: url,
            });
        }
    };
    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <>
            {nav.share ? (
                <a onClick={handleShare}>Играть вместе</a>
            ) : (
                <CopyToClipboard onCopy={handleCopy} text={url}>
                    <a onClick={handleShare}>Играть вместе</a>
                </CopyToClipboard>
            )}
            <span className={cn('copied', { visible: isCopied })}>Ссылка скопирована!</span>
        </>
    );
};
