import { useEffect, useState } from 'react';

const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];

export const useKonamiCode = () => {
    const [isTriggered, setIsTriggered] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === KONAMI_CODE[index]) {
                const nextIndex = index + 1;
                if (nextIndex === KONAMI_CODE.length) {
                    setIsTriggered(true);
                    setIndex(0);
                } else {
                    setIndex(nextIndex);
                }
            } else {
                setIndex(0);
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [index]);

    return isTriggered;
};
