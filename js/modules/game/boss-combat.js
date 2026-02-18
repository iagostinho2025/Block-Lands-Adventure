export function processBossTurn(game, damageDealt) {
    if (damageDealt) {
        game.bossState.movesWithoutDamage = 0;
    } else {
        game.bossState.movesWithoutDamage++;
        if (game.bossState.movesWithoutDamage >= game.bossState.attackRate) {
            game.triggerBossAttack();
            game.bossState.movesWithoutDamage = 0;
        }
    }
}

export function triggerBossAttack(game, deps = {}) {
    const bossLogic = deps.bossLogic || {};
    game.effects.shakeScreen();
    const bossId = (game.currentLevelConfig.boss?.id) || 'dragon_ignis';

    try {
        const behavior = bossLogic ? bossLogic[bossId] : null;
        if (behavior?.onAttack) behavior.onAttack(game);
    } catch (e) {
        console.warn('Boss logic error', e);
    }
}

export function triggerScreenFlash(_game, color) {
    document.body.style.transition = 'background-color 0.1s';
    const oldBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = color;
    setTimeout(() => {
        document.body.style.backgroundColor = oldBg;
    }, 200);
}

export function transformCell(game, r, c, newData) {
    game.grid[r][c] = newData;
    const idx = r * 8 + c;
    const cells = game._boardCells || game.boardEl.children;
    const el = cells[idx];
    if (el) {
        el.style.transform = 'scale(0)';
        setTimeout(() => {
            game.renderGrid();
            const refreshCells = game._boardCells || game.boardEl.children;
            const newEl = refreshCells[idx];
            if (newEl) {
                newEl.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    newEl.style.transform = 'scale(1)';
                }, 150);
            }
        }, 100);
    }
}

export function damageBoss(game, amount) {
    if (!amount) return;

    game._pendingBossDamage = (game._pendingBossDamage || 0) + amount;
    if (game._bossDamageRaf) return;

    game._bossDamageRaf = requestAnimationFrame(() => {
        game._bossDamageRaf = 0;

        const dmg = game._pendingBossDamage || 0;
        game._pendingBossDamage = 0;

        if (dmg <= 0) return;

        game.bossState.currentHp = Math.max(0, game.bossState.currentHp - dmg);
        game.updateBossUI();

        if (game.bossState.currentHp <= 0 && !game._bossWinScheduled) {
            game._bossWinScheduled = true;
            setTimeout(() => {
                game._bossWinScheduled = false;
                game.gameWon({}, []);
            }, 500);
            return;
        }

        game.flushDeferredBossPostChecks();
    });
}

export function updateBossUI(game) {
    if (!game._bossUI) {
        game._bossUI = {
            bar: document.getElementById('boss-hp-bar'),
            text: document.getElementById('boss-hp-text')
        };
    }

    const bar = game._bossUI.bar;
    const text = game._bossUI.text;

    const pct = (game.bossState.currentHp / game.bossState.maxHp) * 100;

    if (bar) {
        const w = pct + '%';
        if (bar.style.width !== w) bar.style.width = w;
    }

    if (text) {
        const current = Math.ceil(game.bossState.currentHp);
        const newText = `${current}/${game.bossState.maxHp}`;
        if (text.textContent !== newText) text.textContent = newText;
    }

    game.updateBossHud();
}
