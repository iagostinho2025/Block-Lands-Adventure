export function clearTheme() {
    document.body.className = '';
}

export function retryGame(game) {
    game.modalOver.classList.add('hidden');
    game.modalWin.classList.add('hidden');
    game._resultResolved = false;

    if (game.audio) game.audio.stopMusic();
    game.cancelPendingSaveGameState();
    game._saveDisabled = false;
    game._emptyCells = null;
    game._emptyCellsDirty = true;

    if (game.currentMode === 'adventure' && game.currentLevelConfig) {
        setTimeout(() => {
            game.startAdventureLevel(game.currentLevelConfig);
        }, 10);
    } else if (game.currentMode === 'classic') {
        game.startClassicMode();
    } else {
        game.resetGame();
    }
}

export function resetGame(game) {
    game.grid = Array(game.gridSize).fill().map(() => Array(game.gridSize).fill(null));
    game.score = 0;
    game.interactionMode = null;
    game.comboState = { count: 0, lastClearTime: 0 };
    game._pendingSyncedBossImpacts = 0;
    game._postImpactMoveCheckNeeded = false;
    game._postImpactBossTurnEndNeeded = false;
    game._resultResolved = false;

    game.heroState = {
        thalion: { unlocked: false, used: false },
        nyx: { unlocked: false, used: false },
        player: { unlocked: false, used: false, lineCounter: 0 },
        mage: { unlocked: false, used: false, lineCounter: 0 }
    };

    game.bossState.active = (game.currentLevelConfig?.type === 'boss');
    game.powerUsedThisLevel = false;

    game.loadPowerUps();
    game.renderControlsUI();

    if (!game.bossState.active) {
        const goals = (game.currentMode === 'casual') ? { bee: 10, ghost: 10, cop: 10 } : game.currentGoals;
        game.setupGoalsUI(goals);
    } else {
        if (!document.getElementById('boss-hp-bar')) {
            const bossData = game.currentLevelConfig?.boss || { id: 'dragon', name: 'Dragao', emoji: '\u{1F409}', maxHp: 50 };
            game.setupBossUI(bossData);
        }
        game.ensureBossHud(game.currentLevelConfig?.boss);
        game.bossState.currentHp = game.bossState.maxHp;
        game.updateBossUI();
    }

    if (game.currentMode === 'adventure' && game.currentLevelConfig?.gridConfig) {
        game.currentLevelConfig.gridConfig.forEach((cfg) => {
            if (game.grid[cfg.r]) {
                game.grid[cfg.r][cfg.c] = {
                    type: cfg.type,
                    key: cfg.key,
                    emoji: cfg.emoji
                };
            }
        });
    }

    game._emptyCells = null;
    game._emptyCellsDirty = true;

    game.renderGrid();
    game.spawnNewHand();
}
