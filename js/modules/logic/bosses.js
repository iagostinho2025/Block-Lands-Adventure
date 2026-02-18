// Lógica dos Chefes e Elites

function collectSafeEmptyTargets(game) {
    const N = game.gridSize;
    const rowCounts = Array(N).fill(0);
    const colCounts = Array(N).fill(0);
    const grid = game.grid;

    for (let r = 0; r < N; r++) {
        const row = grid[r];
        for (let c = 0; c < N; c++) {
            if (row[c] !== null) {
                rowCounts[r]++;
                colCounts[c]++;
            }
        }
    }

    const targets = [];
    for (let r = 0; r < N; r++) {
        const row = grid[r];
        for (let c = 0; c < N; c++) {
            if (row[c] === null && rowCounts[r] < N - 1 && colCounts[c] < N - 1) {
                targets.push({ r, c });
            }
        }
    }

    return targets;
}

function placeRandomObstacle(game, obstacle, flashColor, count = 1) {
    const validTargets = collectSafeEmptyTargets(game);
    if (validTargets.length === 0) return false;

    const total = Math.max(1, Math.min(count, validTargets.length));
    for (let i = 0; i < total; i++) {
        const targetIndex = Math.floor(Math.random() * validTargets.length);
        const target = validTargets.splice(targetIndex, 1)[0];
        game.grid[target.r][target.c] = obstacle;
    }

    game.renderGrid();
    if (flashColor) game.triggerScreenFlash(flashColor);
    return true;
}

function transformCells(game, fromKey, toObstacle, flashColor) {
    let changed = false;
    game.grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell && cell.key === fromKey) {
                game.grid[r][c] = toObstacle;
                changed = true;
            }
        });
    });

    if (changed) {
        game.renderGrid();
        if (flashColor) game.triggerScreenFlash(flashColor);
    }

    return changed;
}

export const BOSS_LOGIC = {
    // BOSS TUTORIAL: GUARDIÃO
    'guardian': {
        name: 'Guardião dos Mundos',
        emoji: '🗿',
        maxHp: 15,
        onAttack: (game) => {
            placeRandomObstacle(
                game,
                { type: 'OBSTACLE', key: 'ancestral_portal', emoji: '🧿' },
                '#3b82f6'
            );

            game.bossState.currentHp = Math.min(game.bossState.maxHp, game.bossState.currentHp + 1);
            game.updateBossUI();
            game.triggerScreenFlash('#22c55e');
        }
    },

    // ELITE NÍVEL 10: MAGMOR
    'magmor': {
        name: 'Magmor',
        emoji: '👺',
        maxHp: 25,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 5 === 0) {
                placeRandomObstacle(
                    game,
                    { type: 'OBSTACLE', key: 'coal', emoji: '⚫' },
                    '#57534e'
                );
            }
        }
    },

    // ELITE NÍVEL 15: FÊNIX INFERNAL
    'pyra': {
        name: 'Fênix Infernal',
        emoji: '🦅',
        maxHp: 35,
        onTurnEnd: (game) => {
            if (typeof game.bossState.regenCounter === 'undefined') {
                game.bossState.regenCounter = 0;
                game.bossState.lastHpCheck = game.bossState.maxHp;
            }

            if (game.bossState.currentHp < game.bossState.lastHpCheck) game.bossState.regenCounter = 0;
            else game.bossState.regenCounter++;

            if (game.bossState.regenCounter >= 3) {
                game.bossState.currentHp = Math.min(game.bossState.maxHp, game.bossState.currentHp + 2);
                game.updateBossUI();
                game.triggerScreenFlash('#22c55e');
                game.bossState.regenCounter = 0;
            }

            game.bossState.lastHpCheck = game.bossState.currentHp;
        }
    },

    // BOSS NÍVEL 20: IGNIS
    'ignis': {
        name: 'Ignis',
        emoji: '🐉',
        maxHp: 50,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 5 === 0) {
                placeRandomObstacle(game, { type: 'OBSTACLE', key: 'coal', emoji: '⚫' }, '#57534e');
            }

            if (typeof game.bossState.regenCounter === 'undefined') {
                game.bossState.regenCounter = 0;
                game.bossState.lastHpCheck = game.bossState.maxHp;
            }

            if (game.bossState.currentHp < game.bossState.lastHpCheck) game.bossState.regenCounter = 0;
            else game.bossState.regenCounter++;

            if (game.bossState.regenCounter >= 3) {
                game.bossState.currentHp = Math.min(game.bossState.maxHp, game.bossState.currentHp + 2);
                game.updateBossUI();
                game.triggerScreenFlash('#22c55e');
                game.bossState.regenCounter = 0;
            }
            game.bossState.lastHpCheck = game.bossState.currentHp;

            if (game.bossState.turnCount % 7 === 0) {
                transformCells(game, 'fire', { type: 'OBSTACLE', key: 'stone', emoji: '🪨' }, '#ef4444');
            }
        }
    },

    // ELITE NÍVEL 30: LOBO ALFA
    'wolf_alpha': {
        name: 'Fenrir',
        emoji: '🐺',
        maxHp: 35,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 4 === 0) {
                transformCells(game, 'leaf', { type: 'OBSTACLE', key: 'claw', emoji: '🐾' }, '#15803d');
            }
        }
    },

    // BOSS FLORESTA: SYLVARIS (usado na fase 40 após promoção)
    'ent_ancient': {
        name: 'Sylvaris',
        emoji: '🌳',
        maxHp: 60,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 4 === 0) {
                transformCells(game, 'leaf', { type: 'OBSTACLE', key: 'thorns', emoji: '🌿' }, '#15803d');
            }

            if (game.bossState.turnCount % 6 === 0) {
                game.bossState.currentHp = Math.min(game.bossState.maxHp, game.bossState.currentHp + 5);
                game.updateBossUI();
                game.triggerScreenFlash('#84cc16');
            }

            if (game.bossState.turnCount % 6 === 0) {
                if (game.sealLeftDock) {
                    const applied = game.sealLeftDock();
                    if (applied) {
                        game.triggerScreenFlash('#7c3aed');
                    }
                }
            }
        }
    },

    // ELITE FLORESTA: ARACNA (usado na fase 35 após troca)
    'aracna': {
        name: 'Aracna',
        emoji: '🕷️',
        maxHp: 45,
        onTurnEnd: (game) => {
            if (typeof game.bossState.rootCounter === 'undefined') game.bossState.rootCounter = 0;
            game.bossState.rootCounter++;

            if (game.bossState.rootCounter % 3 === 0) {
                placeRandomObstacle(game, { type: 'OBSTACLE', key: 'web', emoji: '🕸️' }, '#7c3aed');
            }

            if (game.bossState.rootCounter % 5 === 0) {
                game.bossState.currentHp = Math.min(game.bossState.maxHp, game.bossState.currentHp + 3);
                game.updateBossUI();
                game.triggerScreenFlash('#84cc16');
            }
        }
    },

    // ELITE NÍVEL 50: TROLL
    'troll': {
        name: 'Brakkar',
        emoji: '👹',
        maxHp: 50,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 5 === 0) {
                placeRandomObstacle(game, { type: 'OBSTACLE', key: 'rocks', emoji: '🪨' }, '#78716c');
            }
        }
    },

    // ELITE NÍVEL 55: GIGANTE
    'giant': {
        name: 'Kolgar',
        emoji: '🗿',
        maxHp: 65,
        onTurnEnd: (game) => {
            if (typeof game.bossState.giantCounter === 'undefined') game.bossState.giantCounter = 0;
            game.bossState.giantCounter++;

            if (game.bossState.giantCounter % 4 === 0) {
                transformCells(game, 'pickaxe', { type: 'OBSTACLE', key: 'rocks', emoji: '🪨' }, '#a8a29e');
            }

            if (game.bossState.giantCounter % 6 === 0) {
                game.triggerScreenFlash('#eab308');
            }
        }
    },

    // BOSS NÍVEL 60: GOLEM REI
    'golem_king': {
        name: 'Dravok',
        emoji: '🤖',
        maxHp: 80,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 5 === 0) {
                placeRandomObstacle(game, { type: 'OBSTACLE', key: 'rocks', emoji: '🪨' }, '#78716c');
            }
            if (game.bossState.turnCount % 4 === 0) {
                transformCells(game, 'pickaxe', { type: 'OBSTACLE', key: 'rocks', emoji: '🪨' }, '#a8a29e');
            }
            if (game.bossState.turnCount % 7 === 0) {
                transformCells(game, 'gold', { type: 'OBSTACLE', key: 'debris', emoji: '💥' }, '#dc2626');
            }
        }
    },

    // ELITE NÍVEL 70: MÚMIA
    'mummy': {
        name: 'Zahur',
        emoji: '🧟',
        maxHp: 70,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 6 === 0) {
                transformCells(game, 'bone', { type: 'OBSTACLE', key: 'quicksand', emoji: '🏜️' }, '#92400e');
            }
        }
    },

    // ELITE NÍVEL 75: ZAHREK
    'zahrek': {
        name: 'Zahrek',
        emoji: '🧙‍♂️',
        maxHp: 85,
        onTurnEnd: (game) => {
            if (typeof game.bossState.zahrekCounter === 'undefined') game.bossState.zahrekCounter = 0;
            game.bossState.zahrekCounter++;

            if (game.bossState.zahrekCounter % 4 === 0) {
                transformCells(game, 'sand', { type: 'OBSTACLE', key: 'quicksand', emoji: '🏜️' }, '#a16207');
            }

            if (game.bossState.zahrekCounter % 5 === 0) {
                placeRandomObstacle(game, { type: 'OBSTACLE', key: 'quicksand', emoji: '🏜️' }, '#d97706');
            }
        }
    },

    // BOSS NÍVEL 80: WARLORD GROK
    'warlord_grok': {
        name: 'Azrakar',
        emoji: '👹',
        maxHp: 100,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 6 === 0) {
                transformCells(game, 'bone', { type: 'OBSTACLE', key: 'quicksand', emoji: '🏜️' }, '#92400e');
            }
            if (game.bossState.turnCount % 4 === 0) {
                transformCells(game, 'sand', { type: 'OBSTACLE', key: 'quicksand', emoji: '🏜️' }, '#a16207');
            }
            if (game.bossState.turnCount % 8 === 0) {
                transformCells(game, 'skull', { type: 'OBSTACLE', key: 'sandstorm', emoji: '🌪️' }, '#f59e0b');
            }
        }
    },

    // ELITE NÍVEL 90: GÁRGULA
    'gargoyle': {
        name: 'VEXARA',
        emoji: '🦇',
        maxHp: 100,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 5 === 0) {
                transformCells(game, 'magic', { type: 'OBSTACLE', key: 'shadows', emoji: '🌑' }, '#0f172a');
            }
            if (game.bossState.turnCount % 7 === 0) {
                placeRandomObstacle(game, { type: 'OBSTACLE', key: 'shadows', emoji: '🌑' }, '#1e1b4b');
            }
        }
    },

    // ELITE NÍVEL 95: CAVALEIRO SOMBRIO
    'knight': {
        name: 'Darius',
        emoji: '🛡️',
        maxHp: 120,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 5 === 0) {
                transformCells(game, 'magic', { type: 'OBSTACLE', key: 'shadows', emoji: '🌑' }, '#0f172a');
            }
            if (game.bossState.turnCount % 4 === 0) {
                transformCells(game, 'skull', { type: 'OBSTACLE', key: 'shadows', emoji: '🌑' }, '#312e81');
            }
        }
    },

    // BOSS FINAL NÍVEL 100: MAGO NEGRO
    'dark_wizard': {
        name: 'VORATH',
        emoji: '🧙‍♂️',
        maxHp: 150,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 5 === 0) {
                transformCells(game, 'magic', { type: 'OBSTACLE', key: 'shadows', emoji: '🌑' }, '#0f172a');
            }
            if (game.bossState.turnCount % 4 === 0) {
                transformCells(game, 'skull', { type: 'OBSTACLE', key: 'shadows', emoji: '🌑' }, '#312e81');
            }
            if (game.bossState.turnCount % 6 === 0) {
                transformCells(game, 'crystal', { type: 'OBSTACLE', key: 'void', emoji: '⚫' }, '#7f1d1d');
            }
            if (game.bossState.turnCount % 8 === 0) {
                placeRandomObstacle(game, { type: 'OBSTACLE', key: 'shadows', emoji: '🌑' }, '#4c0519', 2);
            }
        }
    }
};
