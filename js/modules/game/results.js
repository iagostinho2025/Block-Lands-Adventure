export function getClassicResultImageSrc(game) {
    const lang = game.i18n?.currentLang || 'en';
    return lang === 'pt-BR'
        ? 'assets/images/modal_result_classic_pt.webp'
        : 'assets/images/modal_result_classic_en.webp';
}

export function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.floor((ms || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function showClassicResult(game) {
    const modal = document.getElementById('modal-classic-result');
    if (!modal) return;

    if (game.modalOver) game.modalOver.classList.add('hidden');
    if (game.modalWin) game.modalWin.classList.add('hidden');

    const img = document.getElementById('classic-result-image');
    if (img) img.src = getClassicResultImageSrc(game);

    const timeEl = document.getElementById('classic-result-time');
    const scoreEl = document.getElementById('classic-result-score');
    const xpEl = document.getElementById('classic-result-xp');
    const linesEl = document.getElementById('classic-result-lines');
    const comboEl = document.getElementById('classic-result-combo');
    const recordInlineEl = document.getElementById('classic-result-record-inline');
    const scoreRowEl = document.getElementById('classic-result-score-row');

    const duration = Date.now() - (game._classicStartTime || Date.now());
    if (timeEl) timeEl.textContent = formatDuration(duration);
    if (scoreEl) scoreEl.textContent = game.classicState.score.toLocaleString();
    if (xpEl) xpEl.textContent = game._classicMatchXp.toLocaleString();
    if (linesEl) linesEl.textContent = game.classicState.linesCleared.toLocaleString();
    if (comboEl) comboEl.textContent = game._classicMaxCombo.toString();

    if (recordInlineEl) {
        const bestAtStart = Number.isFinite(game._classicBestAtStart)
            ? game._classicBestAtStart
            : game.classicState.bestScore;
        const isRecord = game.classicState.score > bestAtStart;
        if (isRecord) {
            recordInlineEl.classList.remove('hidden');
            recordInlineEl.style.display = 'inline-flex';
        } else {
            recordInlineEl.classList.add('hidden');
            recordInlineEl.style.display = 'none';
        }
        if (scoreRowEl) {
            if (isRecord) scoreRowEl.classList.add('is-record');
            else scoreRowEl.classList.remove('is-record');
        }
    }

    const btnRestart = document.getElementById('btn-classic-restart');
    if (btnRestart) {
        const newBtn = btnRestart.cloneNode(true);
        btnRestart.parentNode.replaceChild(newBtn, btnRestart);
        newBtn.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            modal.classList.add('hidden');
            game.startClassicMode();
        });
    }

    const btnBack = document.getElementById('btn-classic-back');
    if (btnBack) {
        const newBtn = btnBack.cloneNode(true);
        btnBack.parentNode.replaceChild(newBtn, btnBack);
        newBtn.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            modal.classList.add('hidden');
            game.showScreen(game.screenMenu);
        });
    }

    modal.classList.remove('hidden');
    modal.style.pointerEvents = '';
    modal.style.opacity = '';
}

export function getResultImageSrc(game, type) {
    const lang = game.i18n?.currentLang || 'en';
    const isPt = lang === 'pt-BR';
    if (type === 'victory') {
        return isPt
            ? 'assets/images/modal_victory_pt.webp'
            : 'assets/images/modal_victory_en.webp';
    }
    if (type === 'defeat') {
        return isPt
            ? 'assets/images/modal_defeat_pt.webp'
            : 'assets/images/modal_defeat_en.webp';
    }
    return null;
}

export function applyResultImage(game, type) {
    if (game.currentMode !== 'adventure' || !game.currentLevelConfig) return;
    const modalId = type === 'victory' ? 'modal-victory' : 'modal-gameover';
    const modal = document.getElementById(modalId);
    const img = modal?.querySelector('.result-header-image img');
    if (!img) return;

    const src = getResultImageSrc(game, type);
    if (src) img.src = src;
}

export function gameWon(game, collectedGoals = {}, earnedRewards = [], deps = {}) {
    const worlds = deps.worlds || [];
    const emojiMap = deps.emojiMap || {};
    const xpRewards = deps.xpRewards || {};

    if (game._resultResolved) return;
    game._resultResolved = true;
    if (game.modalOver) game.modalOver.classList.add('hidden');

    game.clearSavedGame();

    if (game.achievements && game.currentLevelConfig) {
        const levelId = game.currentLevelConfig.id;
        game.achievements.trackEvent('level_complete', { level: levelId });

        if (game.bossState.active && game.currentLevelConfig.boss) {
            const bossId = game.currentLevelConfig.boss.id;
            const noPowers = !game.powerUsedThisLevel;

            game.achievements.trackEvent('boss_defeat', {
                boss: bossId,
                noPowers: noPowers
            });

            const worldBosses = ['ignis', 'ent_ancient', 'golem_king', 'warlord_grok', 'dark_wizard'];
            if (worldBosses.includes(bossId)) {
                const worldId = game.getCurrentWorld();
                if (worldId) {
                    game.achievements.trackEvent('world_complete', { world: worldId });
                }
            }
        }
    }

    if (game.currentMode === 'adventure') {
        game.awardXP(xpRewards.levelComplete || 0, 'Conclusao de fase');

        if (game.bossState.active && game.currentLevelConfig?.boss) {
            game.awardXP(xpRewards.bossDefeat || 0, 'Derrota de boss');
        }
    }

    if (game.currentMode === 'adventure') {
        let stars = 1;
        if (game.score >= 1000) stars = 3;
        else if (game.score >= 500) stars = 2;
        game.rewardAdventureLevel(stars);
    }

    if (game.audio) {
        game.audio.stopMusic();
        game.audio.playClear(3);
        if (game.audio.playSound && game.audio.playVictory) game.audio.playVictory();
        game.audio.vibrate([100, 50, 100, 50, 200]);
    }

    const modal = document.getElementById('modal-victory');
    const rewardsGrid = document.getElementById('victory-rewards-grid');
    const rewardsSection = document.getElementById('victory-rewards-section');
    applyResultImage(game, 'victory');
    const guardianRewardsSection = document.getElementById('victory-guardian-rewards');
    const guardianCrystalsEl = document.getElementById('guardian-reward-crystals');
    const guardianXpEl = document.getElementById('guardian-reward-xp');
    const guardianPowerupSlot = document.getElementById('guardian-reward-powerup');
    const guardianPowerupIcon = document.getElementById('guardian-reward-powerup-icon');
    const guardianPowerupText = document.getElementById('guardian-reward-powerup-text');

    if (rewardsGrid) rewardsGrid.innerHTML = '';

    if (earnedRewards && earnedRewards.length > 0 && rewardsSection) {
        rewardsSection.classList.remove('hidden');
        earnedRewards.forEach((item) => {
            const emoji = emojiMap[item.type] || '\u{1F381}';
            rewardsGrid.innerHTML += `
                    <div class="result-slot reward">
                        <div class="slot-icon">${emoji}</div>
                        <div class="slot-count">+${item.count}</div>
                    </div>`;
        });
    } else if (rewardsSection) {
        rewardsSection.classList.add('hidden');
    }

    if (guardianRewardsSection && game.currentMode === 'adventure') {
        if (rewardsSection) {
            rewardsSection.classList.add('hidden');
            rewardsSection.style.display = 'none';
        }
        const crystalsEarned = game._matchRewards?.crystals || 0;
        const xpEarned = game._matchRewards?.xp || 0;
        if (guardianCrystalsEl) guardianCrystalsEl.textContent = `+${crystalsEarned}`;
        if (guardianXpEl) guardianXpEl.textContent = `+${xpEarned} XP`;

        if (guardianPowerupSlot) {
            const drop = game.rollAdventurePowerupReward();
            if (drop) {
                const icon = emojiMap[drop.type] || '✨';
                if (guardianPowerupIcon) guardianPowerupIcon.textContent = icon;
                if (drop.isFull) {
                    guardianPowerupSlot.classList.add('reward-locked');
                    if (guardianPowerupText) guardianPowerupText.textContent = game.getSlotFullLabel();
                } else {
                    guardianPowerupSlot.classList.remove('reward-locked');
                    if (guardianPowerupText) guardianPowerupText.textContent = '+1';
                }
                guardianPowerupSlot.style.display = '';
            } else {
                guardianPowerupSlot.style.display = 'none';
            }
        }

        guardianRewardsSection.classList.remove('hidden');
        guardianRewardsSection.style.display = '';
    } else if (guardianRewardsSection) {
        guardianRewardsSection.classList.add('hidden');
        guardianRewardsSection.style.display = 'none';
    }

    let nextLevelId = 0;
    if (game.currentMode === 'adventure' && game.currentLevelConfig) {
        nextLevelId = game.currentLevelConfig.id + 1;
        game.saveProgress(nextLevelId);
    }

    const currentWorld = worlds.find((w) => w.levels.some((l) => l.id === game.currentLevelConfig.id));
    let nextLevelConfig = null;

    if (currentWorld && game.currentLevelConfig.id !== 0) {
        nextLevelConfig = currentWorld.levels.find((l) => l.id === nextLevelId);
    }

    const btnContinue = document.getElementById('btn-next-level');
    if (btnContinue) {
        const newBtn = btnContinue.cloneNode(true);
        btnContinue.parentNode.replaceChild(newBtn, btnContinue);

        newBtn.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            modal.classList.add('hidden');

            const levelId = game.currentLevelConfig?.id;
            if (levelId === 0 && localStorage.getItem('blocklands_story_guardian_seen') !== 'true') {
                localStorage.setItem('blocklands_story_guardian_seen', 'true');
                game.showSingleStory({
                    textKey: 'story_guardian_gate_opening',
                    imageSrc: 'assets/img/story_guardian_gate_opening.webp',
                    onDone: () => {
                        game.showScreen(game.screenLevels);
                        game.showWorldSelect();
                    }
                });
                return;
            }

            if (levelId === 20 && localStorage.getItem('blocklands_story_fire_ignis_seen') !== 'true') {
                localStorage.setItem('blocklands_story_fire_ignis_seen', 'true');
                game.showSingleStory({
                    textKey: 'story_fire_ignis_aftermath',
                    imageSrc: 'assets/img/story_fire_ignis_aftermath.webp',
                    onDone: () => {
                        game.showScreen(game.screenLevels);
                        game.showWorldSelect();
                    }
                });
                return;
            }

            if (levelId === 40 && localStorage.getItem('blocklands_story_forest_aracna_seen') !== 'true') {
                localStorage.setItem('blocklands_story_forest_aracna_seen', 'true');
                game.showSingleStory({
                    textKey: 'story_forest_aracna_aftermath',
                    imageSrc: 'assets/img/story_forest_aracna_aftermath.webp',
                    onDone: () => {
                        game.showScreen(game.screenLevels);
                        game.showWorldSelect();
                    }
                });
                return;
            }

            if (levelId === 60 && localStorage.getItem('blocklands_story_mountain_golem_seen') !== 'true') {
                localStorage.setItem('blocklands_story_mountain_golem_seen', 'true');
                game.showSingleStory({
                    textKey: 'story_mountain_golem_aftermath',
                    imageSrc: 'assets/img/story_mountain_golem_aftermath.webp',
                    onDone: () => {
                        game.showScreen(game.screenLevels);
                        game.showWorldSelect();
                    }
                });
                return;
            }

            if (levelId === 80 && localStorage.getItem('blocklands_story_desert_grok_seen') !== 'true') {
                localStorage.setItem('blocklands_story_desert_grok_seen', 'true');
                game.showSingleStory({
                    textKey: 'story_desert_grok_aftermath',
                    imageSrc: 'assets/img/story_desert_grok_aftermath.webp',
                    onDone: () => {
                        game.showScreen(game.screenLevels);
                        game.showWorldSelect();
                    }
                });
                return;
            }

            if (levelId === 100 && localStorage.getItem('blocklands_story_castle_dark_wizard_seen') !== 'true') {
                localStorage.setItem('blocklands_story_castle_dark_wizard_seen', 'true');
                game.showSingleStory({
                    textKey: 'story_castle_dark_wizard_aftermath',
                    imageSrc: 'assets/img/story_castle_dark_wizard_aftermath.webp',
                    onDone: () => {
                        game.showScreen(game.screenLevels);
                        game.showWorldSelect();
                    }
                });
                return;
            }

            if (nextLevelConfig) {
                document.body.className = '';
                game.startAdventureLevel(nextLevelConfig);
            } else {
                game.showScreen(game.screenLevels);
                game.showWorldSelect();
            }
        });
    }

    const btnBack = document.getElementById('btn-victory-back');
    if (btnBack) {
        const newBack = btnBack.cloneNode(true);
        btnBack.parentNode.replaceChild(newBack, btnBack);

        newBack.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            modal.classList.add('hidden');

            if (game.currentLevelConfig && game.currentLevelConfig.id === 0) {
                game.showScreen(game.screenMenu);
            } else {
                game.showScreen(game.screenLevels);
                if (currentWorld) {
                    game.openWorldMap(currentWorld);
                } else {
                    game.showWorldSelect();
                }
            }
        });
    }

    modal.classList.remove('hidden');
    game._matchRewardsActive = false;
}

export function gameOver(game) {
    if (game._resultResolved) return;
    game._resultResolved = true;
    if (game.modalWin) game.modalWin.classList.add('hidden');

    game._saveDisabled = true;
    game.cancelPendingSaveGameState();

    if (game.currentMode === 'classic' || game.currentMode === 'casual') {
        if (game.audio) game.audio.stopMusic();
        game._classicXpActive = false;
        showClassicResult(game);
        return;
    }

    game.clearSavedGame();
    game._emptyCells = null;
    game._emptyCellsDirty = true;

    if (game.audio) game.audio.stopMusic();

    const defeatRewardsSection = document.getElementById('defeat-guardian-rewards');
    const defeatCrystalsEl = document.getElementById('defeat-reward-crystals');
    const defeatXpEl = document.getElementById('defeat-reward-xp');
    const defeatPowerupSlot = document.getElementById('defeat-reward-powerup');
    const defeatPowerupIcon = document.getElementById('defeat-reward-powerup-icon');
    const defeatPowerupText = document.getElementById('defeat-reward-powerup-text');

    if (defeatRewardsSection && game.currentMode === 'adventure') {
        const crystalsEarned = game._matchRewards?.crystals || 0;
        const xpEarned = game._matchRewards?.xp || 0;
        if (defeatCrystalsEl) defeatCrystalsEl.textContent = `+${crystalsEarned}`;
        if (defeatXpEl) defeatXpEl.textContent = `+${xpEarned} XP`;
        if (defeatPowerupSlot) {
            defeatPowerupSlot.style.display = 'none';
            defeatPowerupSlot.classList.remove('reward-locked');
            if (defeatPowerupIcon) defeatPowerupIcon.textContent = '✨';
            if (defeatPowerupText) defeatPowerupText.textContent = '+1';
        }
        defeatRewardsSection.classList.remove('hidden');
        defeatRewardsSection.style.display = '';
    } else if (defeatRewardsSection) {
        defeatRewardsSection.classList.add('hidden');
        defeatRewardsSection.style.display = 'none';
    }

    applyResultImage(game, 'defeat');
    game._matchRewardsActive = false;
    if (game.modalOver) game.modalOver.classList.remove('hidden');
}
