export function spawnNewHand(game, deps = {}) {
    const randomPieceFn = deps.randomPieceFn;
    const blitzLetterKeys = deps.blitzLetterKeys || [];
    const blitzItemChance = deps.blitzItemChance ?? 0.2;
    if (typeof randomPieceFn !== 'function') {
        throw new Error('spawnNewHand requires randomPieceFn dependency');
    }
    if (!game.dockEl) return;

    const config = game.currentLevelConfig;
    const customItems = (game.currentMode === 'adventure' && config)
        ? config.items
        : (game.currentMode === 'blitz' ? blitzLetterKeys : null);

    const isBoss = !!(config && config.type === 'boss');
    const useRPGStats = isBoss;
    const isClassic = game.currentMode === 'classic';

    const forceEasy = false;

    const N = game.gridSize;
    let emptyCount = 0;
    const stopAt = 15;

    outer:
    for (let r = 0; r < N; r++) {
        const row = game.grid[r];
        for (let c = 0; c < N; c++) {
            if (!row[c]) {
                emptyCount++;
                if (emptyCount >= stopAt) break outer;
            }
        }
    }

    const isEmergency = emptyCount < 15;
    const blockSquare3x3 = isClassic && !game.canPlaceSquare3x3Anywhere();
    const pieceOptions = blockSquare3x3 ? { excludeShapes: ['square-3x3'] } : undefined;

    if (!game.currentHand) game.currentHand = [];
    game.currentHand.length = 0;
    const classicNamesInHand = isClassic ? new Set() : null;

    for (let i = 0; i < 3; i++) {
        const forceSimple = ((isEmergency && i === 0) || (forceEasy && i === 0));
        let piece = null;

        const maxAttempts = isClassic ? 6 : 1;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let optionsForRoll = pieceOptions;

            if (isClassic) {
                const exclude = [];
                if (pieceOptions?.excludeShapes) exclude.push(...pieceOptions.excludeShapes);
                if (classicNamesInHand.size > 0) exclude.push(...classicNamesInHand);
                optionsForRoll = exclude.length > 0 ? { excludeShapes: exclude } : undefined;
            }

            if (game.currentMode === 'blitz') {
                optionsForRoll = { ...(optionsForRoll || {}), itemChance: blitzItemChance };
            }

            piece = randomPieceFn(customItems, useRPGStats, forceSimple, optionsForRoll);

            if (!isClassic || !classicNamesInHand.has(piece.name)) {
                break;
            }
        }

        if (isClassic && piece.name === 'square-3x3' && !game.canPlacePieceAnywhere(piece)) {
            piece = randomPieceFn(customItems, useRPGStats, true, { excludeShapes: ['square-3x3'] });
        }

        if (isClassic && piece?.name) {
            classicNamesInHand.add(piece.name);
        }
        game.currentHand.push(piece);
    }

    game.renderDock();
    game.saveGameState();

    const doCheck = () => {
        if (game._resultResolved) return;

        const shouldDeferMoveCheck =
            game.currentMode === 'adventure' &&
            game.bossState?.active &&
            game.hasPendingBossResolution();

        if (shouldDeferMoveCheck) {
            game._postImpactMoveCheckNeeded = true;
            return;
        }

        if (!game.checkMovesAvailable()) game.gameOver();
    };

    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(doCheck, { timeout: 150 });
    } else {
        setTimeout(doCheck, 100);
    }
}
