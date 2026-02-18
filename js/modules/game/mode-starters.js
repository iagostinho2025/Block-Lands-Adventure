export function startClassicMode(game, options = {}) {
    const runtimeLogs = options.runtimeLogs === true;

    game.currentMode = 'classic';
    game.currentLevelConfig = null;
    if (game.unsealLeftDock) game.unsealLeftDock();

    // Recarrega recorde para evitar estado desatualizado
    game.classicState.bestScore = parseInt(localStorage.getItem('classic_best_score') || '0');
    game._classicBestAtStart = game.classicState.bestScore;
    game._classicStartTime = Date.now();
    game._classicMatchXp = 0;
    game._classicXpActive = true;
    game._classicMaxCombo = 0;
    game._matchRewardsActive = false;
    const classicModal = document.getElementById('modal-classic-result');
    if (classicModal) classicModal.classList.add('hidden');

    game.updateWorldClass();
    game.updateClassicThemeClass();
    game.updateInfoHelpIcon();

    game.classicState.score = 0;
    game.classicState.level = 1;
    game.classicState.linesCleared = 0;
    game.classicState.comboStreak = 0;
    game.classicState.recordBeaten = false;
    if (game.classicState.comboTimer) {
        clearTimeout(game.classicState.comboTimer);
        game.classicState.comboTimer = null;
    }

    if (game._classicScoreRaf) {
        cancelAnimationFrame(game._classicScoreRaf);
        game._classicScoreRaf = 0;
    }
    if (game._classicScorePopTimer) {
        clearTimeout(game._classicScorePopTimer);
        game._classicScorePopTimer = 0;
    }
    if (game._classicScoreDeltaTimer) {
        clearTimeout(game._classicScoreDeltaTimer);
        game._classicScoreDeltaTimer = 0;
    }
    if (game._classicScoreGlowTimer) {
        clearTimeout(game._classicScoreGlowTimer);
        game._classicScoreGlowTimer = 0;
    }
    if (game._classicScoreMilestoneTimer) {
        clearTimeout(game._classicScoreMilestoneTimer);
        game._classicScoreMilestoneTimer = 0;
    }
    game._classicScoreDisplayed = game.classicState.score;
    game._classicScoreTarget = game.classicState.score;
    game._classicBestDisplay = game.classicState.bestScore;

    const deltaEl = document.getElementById('classic-score-hero-delta');
    if (deltaEl) {
        deltaEl.textContent = '';
        deltaEl.classList.remove('is-visible');
    }

    game.classicState.missions = [];
    game.classicState.missionRewardActive = false;
    game.classicState.missionRewardMultiplier = 1.0;
    if (runtimeLogs) console.log('[MISSIONS] Modo classico sem missoes/objetivos.');

    game.clearTheme();
    game.showScreen(game.screenGame);
    game.resetGame();
    game.queueDockGeometryLog('classic-start');

    const goalsArea = document.getElementById('goals-area');
    if (goalsArea) goalsArea.style.display = 'none';

    game.hideBossHud();

    const powerupsArea = document.getElementById('powerups-area');
    if (powerupsArea) powerupsArea.style.display = 'none';

    const controlsBar = document.getElementById('controls-bar');
    if (controlsBar) controlsBar.style.display = 'none';

    const statsPanel = document.getElementById('classic-stats');
    if (statsPanel) {
        statsPanel.classList.remove('hidden');
        statsPanel.style.display = '';
        game.updateClassicUI();
    }

    const missionsContainer = document.getElementById('classic-missions');
    if (missionsContainer) {
        missionsContainer.classList.remove('hidden');
        missionsContainer.style.display = '';
        game.updateMissionsUI();
    }

    const classicScoreHero = document.getElementById('classic-score-hero');
    if (classicScoreHero) {
        classicScoreHero.classList.remove('hidden');
        classicScoreHero.style.display = '';
        game.updateClassicUI();
    }
}

export function startAdventureLevel(game, levelConfig, options = {}) {
    const runtimeLogs = options.runtimeLogs === true;

    if (runtimeLogs) console.log('[START-ADVENTURE] Iniciando nivel:', levelConfig);

    game.currentMode = 'adventure';
    game.currentLevelConfig = levelConfig;
    if (game.unsealLeftDock) game.unsealLeftDock();
    game._bossNameIntroPlayed = false;
    game._bossNameIntroAnimating = false;
    game._bossNameIntroKey = null;
    game._bossNameIntroActiveKey = null;
    if (game._bossNameIntroAnim) {
        try { game._bossNameIntroAnim.cancel(); } catch (_) {}
        game._bossNameIntroAnim = null;
    }
    if (game._bossNameIntroTimer) {
        clearTimeout(game._bossNameIntroTimer);
        game._bossNameIntroTimer = null;
    }
    if (game._bossNameIntroRetryRaf) {
        cancelAnimationFrame(game._bossNameIntroRetryRaf);
        game._bossNameIntroRetryRaf = 0;
    }
    game.clearBossNameLetterIntro();
    game.resetMatchRewards();
    game._saveDisabled = false;
    game._pendingSyncedBossImpacts = 0;
    game._postImpactMoveCheckNeeded = false;
    game._postImpactBossTurnEndNeeded = false;
    game._resultResolved = false;
    game.showScreen(game.screenGame);

    if (runtimeLogs) console.log('[START-ADVENTURE] currentMode:', game.currentMode);
    if (runtimeLogs) console.log('[START-ADVENTURE] currentLevelConfig:', game.currentLevelConfig);

    game.updateWorldClass();
    game.updateInfoHelpIcon();
    game.maybeShowInfoCard();

    const statsPanel = document.getElementById('classic-stats');
    if (statsPanel) {
        statsPanel.classList.add('hidden');
        statsPanel.style.display = 'none';
    }

    const missionsContainer = document.getElementById('classic-missions');
    if (missionsContainer) {
        missionsContainer.classList.add('hidden');
        missionsContainer.style.display = 'none';
    }

    const classicScoreHero = document.getElementById('classic-score-hero');
    if (classicScoreHero) {
        classicScoreHero.classList.add('hidden');
        classicScoreHero.style.display = 'none';
    }

    const goalsArea = document.getElementById('goals-area');
    if (goalsArea) goalsArea.style.display = '';

    const powerupsArea = document.getElementById('powerups-area');
    if (powerupsArea) powerupsArea.style.display = '';

    const controlsBar = document.getElementById('controls-bar');
    if (controlsBar) controlsBar.style.display = '';

    if (game.audio) {
        if (levelConfig.musicId) {
            game.audio.playMusic(levelConfig.musicId);
        } else if (levelConfig.type === 'boss') {
            game.audio.playBossMusic();
        } else {
            game.audio.stopMusic();
        }
    }

    if (game.restoreGameState(levelConfig.id)) {
        game.queueLayoutGeometryLog('adventure-restore');
        game.queueDockGeometryLog('adventure-restore');
        return;
    }

    if (levelConfig.type === 'boss') {
        const bossData = levelConfig.boss || { id: 'dragon', name: 'Dragao', emoji: '\u{1F409}', maxHp: 50 };
        game.setupBossUI(bossData);
        game.ensureBossHud(bossData);
        game.bossState = { active: true, maxHp: bossData.maxHp, currentHp: bossData.maxHp, attackRate: 3, movesWithoutDamage: 0 };
        game.currentGoals = {};
    } else {
        game.hideBossHud();
        game.bossState.active = false;
        const goals = (levelConfig.goals && Object.keys(levelConfig.goals).length > 0)
            ? levelConfig.goals
            : { bee: 10 };

        game.setupGoalsUI(goals);
    }
    game.resetGame();
    game.queueLayoutGeometryLog('adventure-start');
    game.queueDockGeometryLog('adventure-start');
}

export function startBlitzMode(game) {
    game.currentMode = 'blitz';
    game.currentLevelConfig = null;
    if (game.unsealLeftDock) game.unsealLeftDock();
    game._matchRewardsActive = false;
    game._blitzStartTime = Date.now();
    game._blitzMatchXp = 0;
    game._blitzXpActive = true;
    game._blitzLinesCleared = 0;
    game._blitzMaxCombo = 0;
    game._blitzBlocksDone = 0;
    game._blitzBlocksTotal = 0;
    game.currentGoals = {};
    game.collected = {};
    if (game.bossState) game.bossState.active = false;

    const statsPanel = document.getElementById('classic-stats');
    if (statsPanel) statsPanel.classList.add('hidden');
    const missionsContainer = document.getElementById('classic-missions');
    if (missionsContainer) missionsContainer.classList.add('hidden');
    const classicScoreHero = document.getElementById('classic-score-hero');
    if (classicScoreHero) {
        classicScoreHero.classList.add('hidden');
        classicScoreHero.style.display = 'none';
    }

    game.showScreen(game.screenGame);
    game.resetGame();

    if (game.blitz) {
        game.blitz.enter();
        game.blitz.startRun();
    }
}
