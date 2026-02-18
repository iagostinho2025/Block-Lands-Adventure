export function saveGameState(game) {
    if (game.currentMode !== 'adventure' || !game.currentLevelConfig) return;
    if (game._saveDisabled) return;

    const perfSerializeStart = game.perfStart('save.serialize');

    const state = {
        levelId: game.currentLevelConfig.id,
        grid: game.grid,
        score: game.score,
        hand: game.currentHand,
        bossState: game.bossState,
        heroState: game.heroState,
        currentGoals: game.currentGoals,
        collected: game.collected,
        comboState: game.comboState
        // powerUps NAO e salvo aqui, e gerenciado separadamente no localStorage
    };

    let json;
    try {
        json = JSON.stringify(state);
    } catch (e) {
        console.warn('Falha ao serializar save:', e);
        return;
    }
    game.perfEnd('save.serialize', perfSerializeStart);

    // Dedupe: evita salvar exatamente o mesmo payload repetidamente
    if (json === game._lastSavedJson) return;

    game._pendingSaveJson = json;

    // Invalida qualquer callback anterior
    const myToken = ++game._saveToken;

    if (game._saveTimer) clearTimeout(game._saveTimer);

    // 200~400ms costuma ser bom no mobile
    game._saveTimer = setTimeout(() => {
        // Se algo mudou nesse meio tempo, ignora este callback
        if (game._saveDisabled) return;
        if (myToken !== game._saveToken) return;
        if (!game._pendingSaveJson) return;

        const perfWriteStart = game.perfStart('save.write');
        try {
            localStorage.setItem('blocklands_savestate', game._pendingSaveJson);
            game._lastSavedJson = game._pendingSaveJson;
        } catch (e) {
            console.warn('Falha ao salvar jogo:', e);
        } finally {
            game.perfEnd('save.write', perfWriteStart);
            game._pendingSaveJson = null;
            game._saveTimer = null;
        }
    }, 250);
}

export function cancelPendingSaveGameState(game) {
    // invalida callbacks antigos imediatamente
    game._saveToken++;

    if (game._saveTimer) {
        clearTimeout(game._saveTimer);
        game._saveTimer = null;
    }
    game._pendingSaveJson = null;
}

export function flushSaveGameState(game) {
    if (game._saveDisabled) return;

    // Se tem algo pendente, grava imediatamente
    if (game._pendingSaveJson) {
        try {
            localStorage.setItem('blocklands_savestate', game._pendingSaveJson);
            game._lastSavedJson = game._pendingSaveJson;
        } catch (e) {
            console.warn('Falha ao flush do save:', e);
        } finally {
            game._pendingSaveJson = null;
        }
    }

    // cancela timer por limpeza
    if (game._saveTimer) {
        clearTimeout(game._saveTimer);
        game._saveTimer = null;
    }
}

export function restoreGameState(game, targetLevelId) {
    const raw = localStorage.getItem('blocklands_savestate');
    if (!raw) return false;

    try {
        const state = JSON.parse(raw);

        // Seguranca: so carrega se o save for do mesmo nivel que estamos tentando abrir
        if (state.levelId !== targetLevelId) return false;

        // Restaura os dados
        game.grid = state.grid;
        game.score = state.score;
        game.currentHand = state.hand;
        game.bossState = state.bossState;
        game.heroState = state.heroState;
        game.currentGoals = state.currentGoals;
        game.collected = state.collected;
        game.comboState = state.comboState || { count: 0, lastClearTime: 0 };

        // IMPORTANTE: o grid foi trocado, entao o cache de vazios ficou invalido
        game._emptyCells = null;
        game._emptyCellsDirty = true;

        // Recarrega Powerups do localStorage (fonte da verdade)
        game.loadPowerUps();

        // Atualiza a UI visualmente
        game.renderGrid();
        game.renderDock();
        game.renderControlsUI();

        if (game.bossState.active) {
            game.setupBossUI(game.currentLevelConfig.boss);
            game.ensureBossHud(game.currentLevelConfig.boss);
            game.updateBossUI();
        } else {
            game.setupGoalsUI(game.currentGoals);

            // Reaplica o progresso salvo
            game.collected = state.collected || game.collected;

            // Atualiza numeros/estado completado na UI
            game.updateGoalsUI();
        }

        return true;
    } catch (e) {
        console.error('Erro ao carregar save:', e);
        return false;
    }
}

export function clearSavedGame(game) {
    cancelPendingSaveGameState(game);

    try {
        localStorage.removeItem('blocklands_savestate');
    } catch (e) {
        console.warn('Falha ao remover save:', e);
    }

    game._lastSavedJson = null;
}
