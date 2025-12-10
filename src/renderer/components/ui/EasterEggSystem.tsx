import { useEffect, useState } from 'react';
import { useKonamiCode } from '../../hooks/useKonamiCode';

export const EasterEggSystem = () => {
    const isKonamiTriggered = useKonamiCode();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isKonamiTriggered) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }
    }, [isKonamiTriggered]);

    if (!showConfetti) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
            <div className="animate-bounce text-6xl font-bold text-primary drop-shadow-lg">
                🎉 GOD MODE ENABLED (Not really) 🎉
            </div>
            {/* In a real app we'd use a canvas confetti library here */}
        </div>
    );
};
