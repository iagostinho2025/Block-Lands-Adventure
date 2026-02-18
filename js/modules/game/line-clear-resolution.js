export function checkLines(game, dropX, dropY, deps = {}) {
    const xpRewards = deps.xpRewards || {};
    const runtimeLogs = Boolean(deps.runtimeLogs);
    let linesCleared = 0;
    let damageDealt = false;

    const size = game.gridSize;
    const grid = game.grid;

    // 1) Identifica linhas/colunas completas (sem .every e sem closures)
    const rowsToClear = [];
    const colsToClear = [];

    for (let r = 0; r < size; r++) {
        const row = grid[r];
        let full = true;
        for (let c = 0; c < size; c++) {
            if (row[c] === null) { full = false; break; }
        }
        if (full) rowsToClear.push(r);
    }

    for (let c = 0; c < size; c++) {
        let full = true;
        for (let r = 0; r < size; r++) {
            if (grid[r][c] === null) { full = false; break; }
        }
        if (full) colsToClear.push(c);
    }

    // Se nada a limpar, sai cedo (mantém retorno original)
    if (rowsToClear.length === 0 && colsToClear.length === 0) {
        game._lastLinesCleared = 0;
        return false;
    }

    // 2) CAPTURA VISUAL (sem getBoundingClientRect por célula)
    const visualExplosions = [];

    const boardChildren = game._boardCells || game.boardEl.children;

    // Estes valores precisam estar coerentes com o CSS do board:
    const GAP = 4;
    const PADDING = 8;

    const boardRect = game.boardEl.getBoundingClientRect();

    // mede 1x (ok) para ter o tamanho real da célula
    let cellSizePx = 0;
    const firstCell = game.boardEl.querySelector('.cell');
    if (firstCell) {
        cellSizePx = firstCell.getBoundingClientRect().width;
    } else {
        // fallback seguro
        cellSizePx = (boardRect.width - (PADDING * 2) - (GAP * (size - 1))) / size;
    }

    const step = cellSizePx + GAP;

    // Evita duplicatas em cruzamentos usando bitmap (64) em vez de Set de strings
    const seen = new Uint8Array(size * size);

    // Para o Visual V1: remover a classe em batch (1 timer)
    const isClassicV1 = (game.currentMode === 'classic' && game.classicState.visualV1);
    const classicCellsToPulse = isClassicV1 ? [] : null;
    const isLiteEffects = game.performanceProfile === 'lite' || game._runtimePerfDowngrade;

    const computeRectForCell = (r, c) => {
        const left = boardRect.left + PADDING + (c * step);
        const top = boardRect.top + PADDING + (r * step);
        return { left, top, width: cellSizePx, height: cellSizePx };
    };

    const extractColorClass = (cell) => {
        const cl = cell.classList;
        for (let i = 0; i < cl.length; i++) {
            const s = cl[i];
            if (s === 'lava') return 'lava';
            if (s.length >= 5 && s[0] === 't' && s[1] === 'y' && s[2] === 'p' && s[3] === 'e' && s[4] === '-') return s;
            if (s.startsWith('classic-color-')) return s;
        }
        return 'type-normal';
    };

    const addVisual = (r, c) => {
        const idx = (r * size) + c;
        if (seen[idx]) return;
        seen[idx] = 1;

        const cell = boardChildren[idx];
        if (!cell) return;
        if (!(cell.classList.contains('filled') || cell.classList.contains('lava'))) return;

        if (isClassicV1) {
            cell.classList.add('classic-line-clear');
            classicCellsToPulse.push(cell);
        }

        const rect = computeRectForCell(r, c);
        let clone = null;

        if (!isLiteEffects) {
            clone = cell.cloneNode(true);
            clone.classList.add('cell-explosion');
            clone.style.position = 'fixed';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            clone.style.margin = '0';
            clone.style.zIndex = '9999';
            clone.style.pointerEvents = 'none';
            clone.style.transition = 'none';
            clone.style.transform = 'none';
            clone.style.willChange = 'transform, opacity';
        }

        const colorClass = extractColorClass(cell);

        visualExplosions.push({ clone, rect, colorClass });
    };

    for (let i = 0; i < rowsToClear.length; i++) {
        const r = rowsToClear[i];
        for (let c = 0; c < size; c++) addVisual(r, c);
    }
    for (let i = 0; i < colsToClear.length; i++) {
        const c = colsToClear[i];
        for (let r = 0; r < size; r++) addVisual(r, c);
    }

    if (isClassicV1 && classicCellsToPulse.length) {
        setTimeout(() => {
            for (let i = 0; i < classicCellsToPulse.length; i++) {
                classicCellsToPulse[i].classList.remove('classic-line-clear');
            }
        }, 400);
    }

    // 3) LIMPEZA LÓGICA (mantida)
    game.beginGoalsBatch();
    for (let i = 0; i < rowsToClear.length; i++) {
        if (game.clearRow(rowsToClear[i])) damageDealt = true;
        linesCleared++;
    }
    for (let i = 0; i < colsToClear.length; i++) {
        if (game.clearCol(colsToClear[i])) damageDealt = true;
        linesCleared++;
    }
    game.endGoalsBatch();

    if (linesCleared > 0) {
        if (game.currentMode === 'adventure' && game.unsealLeftDock && game.isLeftDockSealed && game.isLeftDockSealed()) {
            game.unsealLeftDock();
        }

        game.renderGrid();

        const lineXp = linesCleared * xpRewards.lineClear;
        game.awardXP(lineXp, 'Limpeza de linhas');

        // 4) EXECUÇÃO DA ANIMAÇÃO (wave via rAF, sem N timeouts)
        const WAVE_STEP_MS = isLiteEffects ? 8 : 20;
        const REMOVE_AFTER_MS = 400;

        let startTime = performance.now();
        let nextIndex = 0;

        // ✅ Correção: remoção robusta (sem bug de pop/swap)
        const removals = []; // { node, removeAt }

        const tick = (t) => {
            const shouldHave = Math.min(
                visualExplosions.length,
                Math.floor((t - startTime) / WAVE_STEP_MS) + 1
            );

            while (nextIndex < shouldHave) {
                const item = visualExplosions[nextIndex++];

                if (item.clone) {
                    document.body.appendChild(item.clone);

                    requestAnimationFrame(() => {
                        item.clone.classList.add('explode');
                        game.spawnExplosion(item.rect, item.colorClass);

                        if (isClassicV1 && !isLiteEffects) {
                            game.spawnClassicParticles(item.rect, item.colorClass);
                        }
                    });

                    removals.push({ node: item.clone, removeAt: t + REMOVE_AFTER_MS });
                } else {
                    game.spawnExplosion(item.rect, item.colorClass);
                }
            }

            // ✅ Remoção correta por índice (lista pequena → custo irrelevante)
            for (let i = removals.length - 1; i >= 0; i--) {
                if (t >= removals[i].removeAt) {
                    const n = removals[i].node;
                    if (n && n.parentNode) n.remove();
                    removals.splice(i, 1);
                }
            }

            if (nextIndex < visualExplosions.length || removals.length > 0) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);

        // 5) Lógica de Score/Combos (mantida igual)
        const now = Date.now();
        if (now - (game.comboState.lastClearTime || 0) <= 5000) game.comboState.count++;
        else game.comboState.count = 1;
        game.comboState.lastClearTime = now;

        if (game.currentMode === 'classic') {
            const previousScore = game.classicState.score;
            const baseScore = game.calculateClassicScore(linesCleared);
            const comboMultiplier = 1 + (Math.min(game.classicState.comboStreak, 5) * 0.5);
            const missionsEnabled = !!(game.classicState.missions && game.classicState.missions.length > 0);

            if (!missionsEnabled) {
                game.classicState.missionRewardActive = false;
                game.classicState.missionRewardMultiplier = 1.0;
                game.classicState.missionRewardEndTime = null;
            }

            const missionMultiplier = missionsEnabled && game.classicState.missionRewardActive
                ? game.classicState.missionRewardMultiplier
                : 1.0;
            const totalScore = Math.floor(baseScore * comboMultiplier * missionMultiplier);

            game.classicState.score += totalScore;
            game.classicState.linesCleared += linesCleared;
            game.classicState.comboStreak++;
            if (game.classicState.comboStreak > game._classicMaxCombo) {
                game._classicMaxCombo = game.classicState.comboStreak;
            }

            const crossedMilestone = Math.floor(previousScore / 1000) < Math.floor(game.classicState.score / 1000);
            game.showClassicScoreDelta(totalScore, crossedMilestone);

            if (crossedMilestone) {
                game.triggerClassicScoreMilestone();
            } else if (totalScore >= 1000) {
                game.triggerClassicScoreGlow();
            }

            if (game.classicState.score > game.classicState.bestScore) {
                game.classicState.bestScore = game.classicState.score;
                localStorage.setItem('classic_best_score', game.classicState.bestScore.toString());

                if (!game.classicState.recordBeaten) {
                    game.classicState.recordBeaten = true;
                    game._classicBestDisplay = game.classicState.bestScore;
                    if (runtimeLogs) console.log(`[CLASSIC] \u{1F3C6} NEW RECORD! ${game.classicState.bestScore} pontos`);

                    // Recompensa por novo recorde
                    game.rewardNewRecord();

                    if (game.effects && game.effects.showFloatingTextCentered) {
                        game.effects.showFloatingTextCentered('NEW RECORD! \u{1F3C6}', 'feedback-gold');
                    }
                }
            }

            // Verifica marcos de pontuação para cristais (a cada 500 pontos)
            if (game.currentMode === 'classic') {
                game.checkClassicScoreRewards();
            }

            const newLevel = Math.floor(game.classicState.linesCleared / 10) + 1;
            if (newLevel > game.classicState.level) {
                game.classicState.level = newLevel;
                if (runtimeLogs) console.log(`[CLASSIC] LEVEL UP! Nível ${game.classicState.level}`);

                if (game.effects && game.effects.triggerScreenFlash) {
                    game.effects.triggerScreenFlash('#a855f7');
                }
            }

            if (runtimeLogs) console.log(`[CLASSIC] Score: ${game.classicState.score}, Lines: ${game.classicState.linesCleared}, Combo: ${game.classicState.comboStreak}x, +${totalScore}pts`);

            game.updateClassicUI();

            game.updateMissionProgress('line_clear', { count: linesCleared });
            game.updateMissionProgress('combo', {});
            game.updateMissionProgress('score', {});

            // Achievement tracking (batched, optimized)
            if (game.achievements) {
                game.achievements.trackEvent('classic_score', { score: game.classicState.score });
                game.achievements.trackEvent('combo_streak', { streak: game.classicState.comboStreak });
                game.achievements.trackEvent('line_clear', { count: linesCleared });

                // Quad clear (Perfect Clear)
                if (linesCleared === 4) {
                    game.achievements.trackEvent('line_clear', { count: 4 });
                }
            }

            game.showClassicFeedback();
            game.resetClassicComboTimer();

            if (game.isPerfectClear()) {
                game.classicState.score += 2000;
                if (runtimeLogs) console.log('[CLASSIC] \u{1F48E} PERFECT CLEAR! +2000 pontos');

                if (game.effects && game.effects.triggerScreenFlash) {
                    game.effects.triggerScreenFlash('#fbbf24');
                }
                if (game.effects && game.effects.showFloatingTextCentered) {
                    game.effects.showFloatingTextCentered('PERFECT CLEAR! +2000', 'feedback-epic');
                }

                game.updateClassicUI();
            }
        }
        else if (game.currentMode === 'blitz') {
            game._blitzLinesCleared += linesCleared;
            if (game.comboState.count > game._blitzMaxCombo) {
                game._blitzMaxCombo = game.comboState.count;
            }
        }

        const comboCount = game.comboState.count;

        if (comboCount >= 2) {
            const comboXp = (comboCount - 1) * xpRewards.comboStep;
            game.awardXP(comboXp, `Combo x${comboCount}`);
        }

        if (game.currentMode === 'adventure' && game.heroState) {
            let unlockedSomething = false;

            if (comboCount >= 2 && (!game.heroState.thalion.unlocked || game.heroState.thalion.used)) {
                game.heroState.thalion.unlocked = true; game.heroState.thalion.used = false;
                unlockedSomething = true;
            }
            if (comboCount >= 3 && (!game.heroState.nyx.unlocked || game.heroState.nyx.used)) {
                game.heroState.nyx.unlocked = true; game.heroState.nyx.used = false;
                unlockedSomething = true;
            }

            game.heroState.player.lineCounter = (game.heroState.player.lineCounter || 0) + linesCleared;
            if ((game.heroState.player.lineCounter >= 5 || comboCount >= 4) && (!game.heroState.player.unlocked || game.heroState.player.used)) {
                if (game.heroState.player.lineCounter >= 5) game.heroState.player.lineCounter = 0;
                game.heroState.player.unlocked = true; game.heroState.player.used = false;
                unlockedSomething = true;
            }

            game.heroState.mage.lineCounter = (game.heroState.mage.lineCounter || 0) + linesCleared;
            if ((game.heroState.mage.lineCounter >= 5 || comboCount >= 4) && (!game.heroState.mage.unlocked || game.heroState.mage.used)) {
                if (game.heroState.mage.lineCounter >= 5) game.heroState.mage.lineCounter = 0;
                game.heroState.mage.unlocked = true; game.heroState.mage.used = false;
                unlockedSomething = true;
            }

            if (unlockedSomething) {
                game.updateControlsVisuals();
                if (game.audio) game.audio.playTone(600, 'sine', 0.2);
            }
        }

        if (game.bossState.active) {
            game.effects.showComboFeedback(linesCleared, comboCount, 'normal');
            if (game.audio) game.audio.playBossClear(linesCleared);
        } else {
            let soundToPlay = null; let textType = 'normal';
            if (comboCount === 1) {
                textType = 'normal';
                soundToPlay = linesCleared === 1 ? 'clear1' : linesCleared === 2 ? 'clear2' : linesCleared === 3 ? 'clear3' : 'clear4';
            } else if (comboCount === 2) { textType = 'wow'; soundToPlay = 'wow'; }
            else if (comboCount === 3) { textType = 'holycow'; soundToPlay = 'holycow'; }
            else { textType = 'unreal'; soundToPlay = 'unreal'; }

            game.effects.showComboFeedback(linesCleared, comboCount, textType);
            if (game.audio) {
                game.audio.playSound(soundToPlay);
                const vibIntensity = Math.min(comboCount * 30, 200);
                game.audio.vibrate([vibIntensity, 50, vibIntensity]);
            }
        }

        game.score += (linesCleared * 10 * linesCleared) * comboCount;
    }
        game._lastLinesCleared = linesCleared;
        return damageDealt;
}
