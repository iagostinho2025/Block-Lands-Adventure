export function beginGoalsBatch(game) {
    game._goalsBatchDepth = (game._goalsBatchDepth || 0) + 1;
    game._goalsDirty = false;
}

export function endGoalsBatch(game) {
    if (!game._goalsBatchDepth) return;
    game._goalsBatchDepth--;

    if (game._goalsBatchDepth === 0 && game._goalsDirty) {
        game._goalsDirty = false;
        game.updateGoalsUI();
    }
}

export function updateGoalsUI(game) {
    if (!game.currentGoals) return;

    for (const key of Object.keys(game.currentGoals)) {
        const el = document.getElementById(`goal-val-${key}`);
        if (!el) continue;

        const target = game.currentGoals[key];
        const current = game.collected[key] || 0;

        const newText = `${current}/${target}`;
        if (el.textContent !== newText) el.textContent = newText;

        const parent = document.getElementById(`goal-item-${key}`);
        if (parent && current >= target) parent.classList.add('completed');
    }
}

export function checkVictoryConditions(game) {
    if (!game.currentGoals || Object.keys(game.currentGoals).length === 0) return false;

    if (false) {
        const winners = [];
        const inventory = {
            magnet: parseInt(localStorage.getItem('blocklands_powerup_magnet') || '0', 10),
            rotate: parseInt(localStorage.getItem('blocklands_powerup_rotate') || '0', 10),
            swap: parseInt(localStorage.getItem('blocklands_powerup_swap') || '0', 10)
        };

        const isFullInventory = (inventory.magnet >= 3 && inventory.rotate >= 3 && inventory.swap >= 3);

        Object.keys(game.currentGoals).forEach((key) => {
            const currentAmount = game.collected[key] || 0;
            const targetAmount = game.currentGoals[key];

            if (currentAmount >= targetAmount) {
                if (inventory[key] < 3 || isFullInventory) {
                    winners.push(key);
                }
            }
        });

        if (winners.length > 0) {
            const rewardsList = [];

            winners.forEach((powerUp) => {
                const currentAmount = parseInt(localStorage.getItem(`powerup_${powerUp}`) || '0', 10);
                const newAmount = Math.min(currentAmount + 1, 3);
                localStorage.setItem(`powerup_${powerUp}`, newAmount);

                rewardsList.push({ type: powerUp, count: 1 });
            });

            game.loadPowerUps();

            setTimeout(() => {
                game.gameWon(game.collected, rewardsList);
            }, 300);

            return true;
        }
        return false;
    }

    const allMet = Object.keys(game.currentGoals).every((key) => {
        return (game.collected[key] || 0) >= game.currentGoals[key];
    });

    if (allMet) {
        setTimeout(() => {
            game.gameWon(game.collected, []);
        }, 300);
        return true;
    }
    return false;
}
