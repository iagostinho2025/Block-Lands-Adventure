export function loadDailyStats(game) {
    const saved = localStorage.getItem('blocklands_daily_stats');
    if (!saved) {
        return { lastPlayDate: null, firstWinClaimed: false };
    }

    try {
        const stats = JSON.parse(saved);
        const today = new Date().toDateString();

        if (stats.lastPlayDate !== today) {
            stats.firstWinClaimed = false;
            stats.lastPlayDate = today;
            game.saveDailyStats(stats);
        }

        return stats;
    } catch (e) {
        console.warn('[CRYSTALS] Erro ao carregar daily stats:', e);
        return { lastPlayDate: null, firstWinClaimed: false };
    }
}

export function saveDailyStats(_game, stats) {
    try {
        localStorage.setItem('blocklands_daily_stats', JSON.stringify(stats));
    } catch (error) {
        console.error('[CRYSTALS] Erro em saveDailyStats:', error);
    }
}

export function resetMatchRewards(game) {
    game._matchRewards = { crystals: 0, xp: 0 };
    game._matchRewardsActive = true;
}

export function getSlotFullLabel(game) {
    const lang = game.i18n?.currentLang || 'en';
    return lang === 'pt-BR' ? 'Slot cheio' : 'Slot full';
}

export function rollAdventurePowerupReward(game, deps = {}) {
    const maxPowerupCount = deps.maxPowerupCount || 3;
    const chance = 0.08;
    if (Math.random() > chance) return null;

    const types = ['magnet', 'rotate', 'swap'];
    const type = types[Math.floor(Math.random() * types.length)];
    const current = game.powerUps?.[type] || 0;
    const isFull = current >= maxPowerupCount;

    if (!isFull) {
        game.powerUps[type] = current + 1;
        game.savePowerUps();
        game.renderControlsUI();
    }

    return { type, isFull };
}

export function addCrystals(game, amount, reason = 'unknown', animated = true, deps = {}) {
    try {
        if (amount <= 0) return;

        if (game._matchRewardsActive && game.currentMode === 'adventure' && game.currentLevelConfig) {
            game._matchRewards.crystals += amount;
        }

        game.crystals += amount;
        localStorage.setItem('blocklands_crystals', game.crystals.toString());

        console.log(`[CRYSTALS] +${amount} cristais (${reason}). Total: ${game.crystals}`);
        game.updateCrystalDisplay(null);

        if (game.achievements && typeof game.achievements.trackEvent === 'function') {
            try {
                game.achievements.trackEvent('crystals_earned', { amount });
                game.achievements.trackEvent('crystals_total', { total: game.crystals });
            } catch (e) {
                console.warn('[CRYSTALS] Erro ao trackear achievement:', e);
            }
        }
    } catch (error) {
        console.error('[CRYSTALS] ERRO CRITICO em addCrystals:', error);
    }
}

export function updateCrystalDisplay(game, fromValue = null) {
    try {
        const valueText = game.crystals.toLocaleString();

        if (game.crystalValueEl) game.crystalValueEl.textContent = valueText;
        if (game.crystalValueGameEl) game.crystalValueGameEl.textContent = valueText;
        if (game.crystalValueStoreEl) game.crystalValueStoreEl.textContent = valueText;
    } catch (error) {
        console.error('[CRYSTALS] ERRO em updateCrystalDisplay:', error);
    }
}

export function animateCrystalCounter(game, from, to) {
    const duration = 800;
    const startTime = Date.now();
    const diff = to - from;

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 2);
        const currentValue = Math.floor(from + (diff * easeProgress));

        game.crystalValueEl.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            game.crystalValueEl.textContent = to.toLocaleString();
        }
    };

    animate();
}

export function showCrystalNotification(game, amount, reason, deps = {}) {
    const runtimeLogs = Boolean(deps.runtimeLogs);
    if (runtimeLogs) console.log(`[CRYSTALS] \u{1F48E} +${amount} (${game.getCrystalReasonText(reason)})`);
}

export function getCrystalReasonText(_game, reason) {
    const reasons = {
        level_complete: 'Nivel Completado',
        level_2stars: 'Excelente! **',
        level_3stars: 'Perfeito! ***',
        boss_defeated: 'Chefao Derrotado!',
        world_unlocked: 'Novo Mundo!',
        score_milestone: 'Marco de Pontuacao',
        new_record: 'Novo Recorde!',
        mission_complete: 'Missao Completa',
        all_missions: 'Todas as Missoes!',
        first_win: 'Primeira Vitoria do Dia',
        achievement: 'Conquista Desbloqueada'
    };

    return reasons[reason] || 'Cristais Ganhos';
}

export function checkFirstWinOfDay(game) {
    try {
        const today = new Date().toDateString();

        if (game.dailyStats.lastPlayDate !== today) {
            game.dailyStats.lastPlayDate = today;
            game.dailyStats.firstWinClaimed = false;
            game.saveDailyStats(game.dailyStats);
        }

        if (!game.dailyStats.firstWinClaimed) {
            game.dailyStats.firstWinClaimed = true;
            game.saveDailyStats(game.dailyStats);
            game.addCrystals(25, 'first_win');
            return true;
        }

        return false;
    } catch (error) {
        console.error('[CRYSTALS] Erro em checkFirstWinOfDay:', error);
        return false;
    }
}

export function rewardAdventureLevel(game, stars) {
    try {
        let totalCrystals = 10;
        let reason = 'level_complete';

        if (stars === 2) {
            totalCrystals += 5;
            reason = 'level_2stars';
        } else if (stars === 3) {
            totalCrystals += 10;
            reason = 'level_3stars';
        }

        game.addCrystals(totalCrystals, reason);

        if (game.currentLevelConfig && game.currentLevelConfig.isBoss) {
            game.addCrystals(50, 'boss_defeated');
        }

        game.checkFirstWinOfDay();
    } catch (error) {
        console.error('[CRYSTALS] Erro em rewardAdventureLevel:', error);
    }
}

export function checkClassicScoreRewards(game) {
    try {
        const currentScore = game.classicState.score;
        const milestone = 500;

        const currentMilestone = Math.floor(currentScore / milestone);
        const lastMilestone = Math.floor(game.classicState.lastScoreMilestone / milestone);

        if (currentMilestone > lastMilestone) {
            const crystalsToAward = (currentMilestone - lastMilestone) * 5;
            game.addCrystals(crystalsToAward, 'score_milestone', false);
            game.classicState.lastScoreMilestone = currentScore;
        }
    } catch (error) {
        console.error('[CRYSTALS] Erro em checkClassicScoreRewards:', error);
    }
}

export function rewardNewRecord(game) {
    try {
        game.addCrystals(20, 'new_record');
    } catch (error) {
        console.error('[CRYSTALS] Erro em rewardNewRecord:', error);
    }
}

export function rewardMissionComplete(game) {
    try {
        if (game.currentMode !== 'classic') return;
        if (!game.classicState.missions || game.classicState.missions.length === 0) return;
        game.addCrystals(10, 'mission_complete');
    } catch (error) {
        console.error('[CRYSTALS] Erro em rewardMissionComplete:', error);
    }
}

export function rewardAllMissionsComplete(game) {
    try {
        if (game.currentMode !== 'classic') return;
        if (!game.classicState.missions || game.classicState.missions.length === 0) return;
        game.addCrystals(20, 'all_missions');
    } catch (error) {
        console.error('[CRYSTALS] Erro em rewardAllMissionsComplete:', error);
    }
}

export function rewardWorldUnlocked(game) {
    try {
        game.addCrystals(100, 'world_unlocked');
    } catch (error) {
        console.error('[CRYSTALS] Erro em rewardWorldUnlocked:', error);
    }
}
