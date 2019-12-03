import { useState, useLayoutEffect } from 'react';

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

export const useTopBottomBounds = (acceptRef: React.RefObject<HTMLDivElement>, skipRef: React.RefObject<HTMLDivElement>) => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [bounds, setBounds] = useState({ top: 0, bottom: 0 });

    useLayoutEffect(() => {
        if (acceptRef.current && skipRef.current) {
            const { height } = acceptRef.current.getBoundingClientRect();
            const { top } = skipRef.current.getBoundingClientRect();
            setBounds({ top: height, bottom: top });
        }
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);

    return bounds;
};
