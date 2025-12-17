import confetti from 'canvas-confetti';

export function celebrateTaskCompletion() {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#48d1cc', '#5ac8c8', '#6cc0c5', '#7eb7c1'];

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

export function celebrateAchievement(tier: 'bronze' | 'silver' | 'gold' | 'platinum') {
    const duration = 4000;
    const animationEnd = Date.now() + duration;

    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0
    };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const colorMap = {
        bronze: ['#cd7f32', '#b87333', '#8B4513'],
        silver: ['#C0C0C0', '#D3D3D3', '#A9A9A9'],
        gold: ['#FFD700', '#FFC700', '#FFB700'],
        platinum: ['#E5E4E2', '#F0F0F0', '#D3D3D3']
    };

    const colors = colorMap[tier];

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: colors
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: colors
        }));
    }, 250);
}

export function celebrateStreak(days: number) {
    const particleCount = Math.min(days * 5, 100);

    confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#48d1cc', '#ffd700', '#ff6b6b']
    });
}

export function celebrateLevelUp() {
    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ffd700', '#ffed4e', '#ff6b6b']
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ffd700', '#ffed4e', '#ff6b6b']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
