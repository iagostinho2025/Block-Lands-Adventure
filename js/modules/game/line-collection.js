export function clearRow(game, r) {
    let foundDamage = false;
    for (let c = 0; c < game.gridSize; c++) {
        if (game.grid[r][c]) {
            if (game.collectItem(r, c, game.grid[r][c])) foundDamage = true;
            game.grid[r][c] = null;
        }
    }

    game._emptyCellsDirty = true;
    return foundDamage;
}

export function clearCol(game, c) {
    let foundDamage = false;
    for (let r = 0; r < game.gridSize; r++) {
        if (game.grid[r][c]) {
            if (game.collectItem(r, c, game.grid[r][c])) foundDamage = true;
            game.grid[r][c] = null;
        }
    }

    game._emptyCellsDirty = true;
    return foundDamage;
}

export function collectItem(game, r, c, cellData, deps = {}) {
    const itemStats = deps.itemStats || {};
    if (!cellData) return false;

    if (cellData.type === 'ITEM') {
        const key = cellData.key.toLowerCase();
        const emoji = game.getItemGlyph(cellData);

        const shouldSyncDamage = game.currentMode === 'adventure'
            && game.bossState.active
            && game.shouldSyncBossDamageOnFlyImpact();
        const stats = itemStats[key] || itemStats.default;
        const damage = stats ? stats.damage : 1;
        if (shouldSyncDamage) game.beginSyncedBossImpact();

        game.runFlyAnimation(
            r,
            c,
            key,
            emoji,
            shouldSyncDamage ? (() => {
                game.damageBoss(damage);
                game.completeSyncedBossImpact();
            }) : null
        );

        if (game.currentGoals && game.currentGoals[key] !== undefined) {
            game.collected[key] = (game.collected[key] || 0) + 1;

            if (game._goalsBatchDepth > 0) {
                game._goalsDirty = true;
            } else {
                game.updateGoalsUI();
            }
        }

        if (game.currentMode === 'adventure' && game.bossState.active) {
            if (!shouldSyncDamage) {
                game.damageBoss(damage);
            }
            return true;
        }
    }

    return false;
}
