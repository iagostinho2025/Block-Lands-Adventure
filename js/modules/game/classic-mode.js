export function calculateClassicScore(_game, linesCleared) {
    switch (linesCleared) {
        case 1: return 100;
        case 2: return 300;
        case 3: return 600;
        case 4: return 1000;
        default: return 1000 + (linesCleared - 4) * 400;
    }
}

export function updateClassicUI(game) {
    const scoreEl = document.getElementById('classic-score');
    const levelEl = document.getElementById('classic-level');
    const bestEl = document.getElementById('classic-best');
    const heroValueEl = document.getElementById('classic-score-hero-value');
    const heroBestEl = document.getElementById('classic-score-hero-best');

    if (!game._classicUiCache) {
        game._classicUiCache = { score: null, level: null, best: null, heroBest: null };
    }

    if (scoreEl && game._classicUiCache.score !== game.classicState.score) {
        game._classicUiCache.score = game.classicState.score;
        scoreEl.textContent = game.classicState.score.toLocaleString();
    }
    if (levelEl && game._classicUiCache.level !== game.classicState.level) {
        game._classicUiCache.level = game.classicState.level;
        levelEl.textContent = String(game.classicState.level);
    }
    if (bestEl && game._classicUiCache.best !== game.classicState.bestScore) {
        game._classicUiCache.best = game.classicState.bestScore;
        bestEl.textContent = game.classicState.bestScore.toLocaleString();
    }
    if (heroValueEl) game.animateClassicScoreHero(game.classicState.score, heroValueEl);
    if (heroBestEl) {
        const bestLabel = game.i18n?.t ? game.i18n.t('classic.best') : 'Recorde';
        const bestDisplay = Number.isFinite(game._classicBestDisplay) ? game._classicBestDisplay : game.classicState.bestScore;
        const heroBestText = `${bestLabel}: ${bestDisplay.toLocaleString()}`;
        if (game._classicUiCache.heroBest !== heroBestText) {
            game._classicUiCache.heroBest = heroBestText;
            heroBestEl.textContent = heroBestText;
        }
    }
}

export function animateClassicScoreHero(game, targetScore, heroValueEl) {
    if (game.currentMode !== 'classic') {
        heroValueEl.textContent = targetScore.toLocaleString();
        return;
    }

    const startScore = Number.isFinite(game._classicScoreDisplayed)
        ? game._classicScoreDisplayed
        : targetScore;

    if (game._classicScoreRaf) {
        cancelAnimationFrame(game._classicScoreRaf);
        game._classicScoreRaf = 0;
    }

    if (startScore === targetScore) {
        heroValueEl.textContent = targetScore.toLocaleString();
        return;
    }

    const delta = targetScore - startScore;
    const magnitude = Math.abs(delta);
    const duration = Math.min(900, Math.max(320, 320 + Math.sqrt(magnitude) * 18));
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = easeOutCubic(progress);
        const nextValue = Math.round(startScore + (delta * eased));

        if (nextValue !== game._classicScoreDisplayed) {
            game._classicScoreDisplayed = nextValue;
            heroValueEl.textContent = nextValue.toLocaleString();
        }

        if (progress < 1) {
            game._classicScoreRaf = requestAnimationFrame(tick);
            return;
        }

        game._classicScoreRaf = 0;
        game._classicScoreDisplayed = targetScore;
        heroValueEl.textContent = targetScore.toLocaleString();

        if (delta > 0) {
            const popScale = Math.min(1.16, 1.04 + (Math.min(delta, 2000) / 2000) * 0.12);
            heroValueEl.style.setProperty('--score-pop-scale', popScale.toFixed(3));
            game.restartCssAnimationClass(heroValueEl, 'score-pop');

            if (game._classicScorePopTimer) clearTimeout(game._classicScorePopTimer);
            game._classicScorePopTimer = setTimeout(() => {
                heroValueEl.classList.remove('score-pop');
                game._classicScorePopTimer = 0;
            }, 200);
        }
    };

    game._classicScoreTarget = targetScore;
    game._classicScoreRaf = requestAnimationFrame(tick);
}

export function showClassicScoreDelta(game, amount, crossedMilestone = false) {
    if (game.currentMode !== 'classic') return;
    if (!amount || amount <= 0) return;

    const deltaEl = document.getElementById('classic-score-hero-delta');
    if (!deltaEl) return;

    const baseIntensity = Math.min(1.6, 1 + (Math.min(amount, 2000) / 2000) * 0.6);
    const intensity = crossedMilestone ? Math.min(1.9, baseIntensity + 0.2) : baseIntensity;
    const risePx = Math.round(18 * intensity);
    const durationMs = Math.round(680 + ((intensity - 1) * 220));
    const peakScale = (1 + ((intensity - 1) * 0.6)).toFixed(3);

    deltaEl.style.setProperty('--delta-rise', `${risePx}px`);
    deltaEl.style.setProperty('--delta-duration', `${durationMs}ms`);
    deltaEl.style.setProperty('--delta-scale', peakScale);

    deltaEl.textContent = `+${Math.floor(amount).toLocaleString()}`;
    game.restartCssAnimationClass(deltaEl, 'is-visible');

    if (game._classicScoreDeltaTimer) clearTimeout(game._classicScoreDeltaTimer);
    game._classicScoreDeltaTimer = setTimeout(() => {
        deltaEl.classList.remove('is-visible');
        game._classicScoreDeltaTimer = 0;
    }, 740);
}

export function triggerClassicScoreGlow(game) {
    if (game.currentMode !== 'classic') return;

    const heroValueEl = document.getElementById('classic-score-hero-value');
    if (!heroValueEl) return;

    game.restartCssAnimationClass(heroValueEl, 'score-glow');

    if (game._classicScoreGlowTimer) clearTimeout(game._classicScoreGlowTimer);
    game._classicScoreGlowTimer = setTimeout(() => {
        heroValueEl.classList.remove('score-glow');
        game._classicScoreGlowTimer = 0;
    }, 420);
}

export function triggerClassicScoreMilestone(game) {
    if (game.currentMode !== 'classic') return;

    const heroValueEl = document.getElementById('classic-score-hero-value');
    if (!heroValueEl) return;

    game.restartCssAnimationClass(heroValueEl, 'score-milestone');

    if (game._classicScoreMilestoneTimer) clearTimeout(game._classicScoreMilestoneTimer);
    game._classicScoreMilestoneTimer = setTimeout(() => {
        heroValueEl.classList.remove('score-milestone');
        game._classicScoreMilestoneTimer = 0;
    }, 560);
}

export function updateMissionsUI(game) {
    const container = document.getElementById('classic-missions');
    if (!container) return;

    game.classicState.missions.forEach((mission, idx) => {
        const chip = container.children[idx];
        if (!chip) return;

        const textEl = chip.querySelector('.mission-text');
        const progressEl = chip.querySelector('.mission-progress');

        textEl.textContent = mission.text;
        progressEl.textContent = `${mission.progress}/${mission.target}`;

        if (mission.completed) {
            chip.classList.add('completed');
        } else {
            chip.classList.remove('completed');
        }
    });
}

export function updateMissionProgress(game, eventType, eventData, deps = {}) {
    const runtimeLogs = Boolean(deps.runtimeLogs);
    if (game.currentMode !== 'classic') return;
    if (!game.classicState.missions || game.classicState.missions.length === 0) return;

    game.classicState.missions.forEach((mission) => {
        if (mission.completed) return;

        let shouldUpdate = false;

        switch (mission.type) {
            case 'line_clear':
                if (eventType === 'line_clear' && eventData.count >= mission.lineTarget) {
                    mission.progress = Math.min(mission.progress + 1, mission.target);
                    shouldUpdate = true;
                }
                break;

            case 'combo_achievement':
                if (eventType === 'combo') {
                    const target = mission.comboTarget || mission.target;
                    if (game.classicState.comboStreak >= target) {
                        mission.progress = 1;
                        shouldUpdate = true;
                    }
                }
                break;

            case 'score':
                if (eventType === 'score') {
                    mission.progress = Math.min(game.classicState.score, mission.target);
                    shouldUpdate = true;
                }
                break;

            case 'placements':
                if (eventType === 'placement') {
                    mission.progress = Math.min(mission.progress + 1, mission.target);
                    shouldUpdate = true;
                }
                break;

            case 'line_clear_count':
                if (eventType === 'line_clear') {
                    mission.progress = Math.min(mission.progress + eventData.count, mission.target);
                    shouldUpdate = true;
                }
                break;
        }

        if (shouldUpdate && mission.progress >= mission.target && !mission.completed) {
            mission.completed = true;
            game.onMissionCompleted(mission);
            if (runtimeLogs) console.log(`[MISSIONS] Missao concluida: ${mission.text}`);
        }
    });

    game.updateMissionsUI();
}

export function onMissionCompleted(game, mission, deps = {}) {
    const xpRewards = deps.xpRewards || {};
    const runtimeLogs = Boolean(deps.runtimeLogs);
    if (game.currentMode !== 'classic') return;
    if (!game.classicState.missions || game.classicState.missions.length === 0) return;
    const reward = mission.reward;

    game.awardXP(xpRewards.missionComplete || 0, 'Conclusao de missao');
    game.rewardMissionComplete();

    const allCompleted = game.classicState.missions.every((m) => m.completed);
    if (allCompleted) {
        game.rewardAllMissionsComplete();
    }

    if (game.audio) {
        game.audio.playMissionComplete();
    }

    if (game.effects && game.effects.triggerScreenFlash) {
        game.effects.triggerScreenFlash('#22c55e');
    }

    if (reward.type === 'score') {
        game.classicState.score += reward.value;
        if (runtimeLogs) console.log(`[MISSIONS] Recompensa: +${reward.value} pontos`);

        if (game.effects && game.effects.showFloatingTextCentered) {
            const text = game.i18n.t('missions.reward_score').replace('{value}', reward.value);
            game.effects.showFloatingTextCentered(text, 'feedback-gold');
        }
    } else if (reward.type === 'multiplier') {
        game.classicState.missionRewardActive = true;
        game.classicState.missionRewardMultiplier = reward.value;
        game.classicState.missionRewardEndTime = Date.now() + reward.duration;

        if (runtimeLogs) console.log(`[MISSIONS] Recompensa: Multiplicador ${reward.value}x por ${reward.duration / 1000}s`);

        if (game.effects && game.effects.showFloatingTextCentered) {
            const text = game.i18n.t('missions.reward_multiplier').replace('{value}', reward.value);
            game.effects.showFloatingTextCentered(text, 'feedback-purple');
        }

        setTimeout(() => {
            if (Date.now() >= game.classicState.missionRewardEndTime) {
                game.classicState.missionRewardActive = false;
                game.classicState.missionRewardMultiplier = 1.0;
                if (runtimeLogs) console.log('[MISSIONS] Multiplicador expirado');
            }
        }, reward.duration);
    }

    game.classicState.missionsTotal++;
    localStorage.setItem('classic_missions_total', game.classicState.missionsTotal.toString());

    const completedCount = game.classicState.missions.filter((m) => m.completed).length;
    if (completedCount > game.classicState.missionsBestStreak) {
        game.classicState.missionsBestStreak = completedCount;
        localStorage.setItem('classic_missions_best_streak', completedCount.toString());
        if (runtimeLogs) console.log(`[MISSIONS] Nova melhor sequencia: ${completedCount}/3`);
    }

    if (game.achievements) {
        game.achievements.trackEvent('mission_complete', {});
        if (completedCount === 3) {
            game.achievements.trackEvent('mission_perfect_run', {});
        }
    }

    game.updateClassicUI();
}

export function spawnClassicParticles(game, rect, colorClass) {
    let particleCount = 15;
    const perfMode = game.settings?.performanceMode || 'auto';
    const effectiveFps = game._fpsSmoothed > 0 ? game._fpsSmoothed : 60;

    if (perfMode === 'stable60' || game.performanceProfile === 'lite' || game._runtimePerfDowngrade) {
        particleCount = 8;
    } else if (effectiveFps < 45) {
        particleCount = 9;
    } else if (effectiveFps < 55) {
        particleCount = 12;
    }

    if (!game._classicColorMap) {
        game._classicColorMap = {
            'classic-color-1': '#667eea',
            'classic-color-2': '#f093fb',
            'classic-color-3': '#4facfe',
            'classic-color-4': '#43e97b',
            'classic-color-5': '#fa709a',
            'classic-color-6': '#feca57',
            'classic-color-7': '#ee5a6f',
            'classic-color-8': '#c471ed'
        };
    }

    const baseColor = game._classicColorMap[colorClass] || '#667eea';
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;

    if (!game._classicParticlePool) game._classicParticlePool = [];
    if (!game._classicParticlesActive) game._classicParticlesActive = [];

    const pool = game._classicParticlePool;
    const active = game._classicParticlesActive;

    if (active.length > 40) {
        particleCount = Math.max(6, Math.floor(particleCount * 0.6));
    }

    const acquire = () => {
        const p = pool.pop();
        if (p) return p;

        const el = document.createElement('div');
        el.className = 'classic-particle';
        el.style.willChange = 'transform, opacity';
        return el;
    };

    const twoPi = Math.PI * 2;
    const lifeMs = 800;
    const now = performance.now();

    for (let i = 0; i < particleCount; i++) {
        const particle = acquire();

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.background = baseColor;

        const angle = (twoPi * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const speed = 50 + Math.random() * 100;

        const tx = Math.cos(angle) * speed;
        const ty = Math.sin(angle) * speed;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        particle.classList.remove('active');
        document.body.appendChild(particle);
        active.push({ el: particle, killAt: now + lifeMs });

        requestAnimationFrame(() => {
            particle.classList.add('active');
        });
    }

    if (!game._classicParticlesTicking) {
        game._classicParticlesTicking = true;

        const tick = (t) => {
            for (let i = active.length - 1; i >= 0; i--) {
                if (t >= active[i].killAt) {
                    const el = active[i].el;
                    if (el && el.parentNode) el.remove();
                    pool.push(el);
                    active.splice(i, 1);
                }
            }

            if (active.length > 0) {
                requestAnimationFrame(tick);
            } else {
                game._classicParticlesTicking = false;
            }
        };

        requestAnimationFrame(tick);
    }
}

export function resetClassicComboTimer(game, deps = {}) {
    const runtimeLogs = Boolean(deps.runtimeLogs);
    if (game.classicState.comboTimer) {
        clearTimeout(game.classicState.comboTimer);
    }

    game.classicState.comboTimer = setTimeout(() => {
        if (game.classicState.comboStreak > 0) {
            if (runtimeLogs) console.log('[CLASSIC] Combo quebrado!');
            game.classicState.comboStreak = 0;
        }
    }, 3000);
}

export function showClassicFeedback(game) {
    const streak = game.classicState.comboStreak;
    let text = '';

    if (streak === 1) text = game.i18n.t('classic.feedback_good');
    else if (streak === 2) text = game.i18n.t('classic.feedback_great');
    else if (streak === 3) text = game.i18n.t('classic.feedback_excellent');
    else if (streak === 4) text = game.i18n.t('classic.feedback_perfect');
    else if (streak >= 5) text = game.i18n.t('classic.feedback_unreal');

    if (text && game.effects && game.effects.showFloatingText) {
        game.effects.showFloatingText(text, {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            size: 48,
            color: '#fbbf24',
            duration: 800
        });
    }
}

export function generateMissionPool(game) {
    return [
        { id: 'clear_2x', type: 'line_clear', target: 2, lineTarget: 2, text: game.i18n.t('missions.clear_2x'), progress: 0, completed: false, reward: { type: 'score', value: 200 } },
        { id: 'combo_3x', type: 'combo_achievement', target: 1, comboTarget: 3, text: game.i18n.t('missions.combo_3x'), progress: 0, completed: false, reward: { type: 'multiplier', value: 1.1, duration: 30000 } },
        { id: 'score_500', type: 'score', target: 500, text: game.i18n.t('missions.score_500'), progress: 0, completed: false, reward: { type: 'score', value: 100 } },
        { id: 'placements_5', type: 'placements', target: 5, text: game.i18n.t('missions.placements_5'), progress: 0, completed: false, reward: { type: 'multiplier', value: 1.1, duration: 30000 } },
        { id: 'clear_1x_5', type: 'line_clear_count', target: 5, text: game.i18n.t('missions.clear_1x_5'), progress: 0, completed: false, reward: { type: 'score', value: 300 } }
    ];
}

export function generateRandomMissions(game) {
    const pool = game.generateMissionPool();
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((m) => ({ ...m }));
}

export function isPerfectClear(game) {
    return game.grid.every((row) => row.every((cell) => cell === null));
}
