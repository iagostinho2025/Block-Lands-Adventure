export function loadSettings(game) {
    const saved = localStorage.getItem('blocklands_settings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                game.settings = { ...game.settings, ...parsed };
            }
        } catch (error) {
            console.warn('[SETTINGS] Failed to parse settings, using defaults.', error);
        }
    }
    if (!game.settings.performanceMode) game.settings.performanceMode = 'auto';
    game.applySettings();
}

export function saveSettings(game) {
    localStorage.setItem('blocklands_settings', JSON.stringify(game.settings));
    game.applySettings();
}

export function applySettings(game) {
    if (game.audio) {
        if (game.audio.bgmGain) {
            game.audio.bgmGain.gain.value = game.settings.music ? 0.3 : 0;
        }
        if (game.audio.masterGain) {
            game.audio.masterGain.gain.value = game.settings.sfx ? 0.5 : 0;
        }
    }
    game.applyPerformancePreference();
}

export function loadProgress(game, deps = {}) {
    const {
        debugUnlockAllAdventure = false,
        debugUnlockAllAdventureLevel = 0
    } = deps;

    const saved = localStorage.getItem('blocklands_progress_main');
    const parsed = saved ? parseInt(saved, 10) : 0;
    const progress = Number.isFinite(parsed) ? parsed : 0;

    if (debugUnlockAllAdventure) {
        return Math.max(progress, debugUnlockAllAdventureLevel);
    }

    return progress;
}

export function saveProgress(game, levelId) {
    const raw = localStorage.getItem('blocklands_progress_main');
    const parsed = raw ? parseInt(raw, 10) : 0;
    const currentSaved = Number.isFinite(parsed) ? parsed : 0;
    if (levelId > currentSaved) {
        localStorage.setItem('blocklands_progress_main', levelId);
    }
}

export function isAdventureLevelUnlocked(game, levelId, deps = {}) {
    const { debugUnlockAllAdventure = false } = deps;
    if (debugUnlockAllAdventure) return true;
    const currentProgress = game.loadProgress();
    return levelId <= currentProgress;
}

export function getCompletedAdventureLevels(game) {
    const raw = localStorage.getItem('blocklands_completed_levels');
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        const normalized = parsed
            .map((v) => parseInt(v, 10))
            .filter((v) => Number.isFinite(v));
        return Array.from(new Set(normalized));
    } catch (_) {
        return [];
    }
}

export function markAdventureLevelCompleted(game, levelId) {
    const level = parseInt(levelId, 10);
    if (!Number.isFinite(level)) return;

    const current = getCompletedAdventureLevels(game);
    if (current.includes(level)) return;

    current.push(level);
    localStorage.setItem('blocklands_completed_levels', JSON.stringify(current));
}

export function initProgressionUI(game) {
    game.progressionEls = {
        avatar: document.getElementById('rank-avatar'),
        rank: document.getElementById('rank-title'),
        xpFill: document.getElementById('rank-xp-fill'),
        xpText: document.getElementById('rank-xp-text')
    };
}

export function updateProgressionUI(game, snapshot, deps = {}) {
    const { getRomanNumeral } = deps;

    if (!snapshot) return;
    if (!game.progressionEls) game.initProgressionUI();

    const { avatar, rank, xpFill, xpText } = game.progressionEls || {};
    const roman = snapshot.levelRoman || (typeof getRomanNumeral === 'function' ? getRomanNumeral(snapshot.level) : snapshot.level);
    const rankText = `${snapshot.rank} ${roman}`;

    if (rank) rank.textContent = rankText;
    if (xpText) xpText.textContent = `${snapshot.xp} / ${snapshot.xpToNext}`;

    if (xpFill) {
        const percent = snapshot.xpToNext > 0 ? Math.min((snapshot.xp / snapshot.xpToNext) * 100, 100) : 0;
        xpFill.style.width = `${percent}%`;
    }

    if (avatar && snapshot.rankInfo) {
        if (game.lastRankIndex !== snapshot.rankIndex) {
            avatar.textContent = snapshot.rankInfo.avatar;
            avatar.style.background = snapshot.rankInfo.theme.bg;
            avatar.style.borderColor = snapshot.rankInfo.theme.border;
            game.lastRankIndex = snapshot.rankIndex;
        }
    }
}

export function awardXP(game, amount, reason) {
    if (!game.progression) return;
    if (game._matchRewardsActive && game.currentMode === 'adventure' && game.currentLevelConfig) {
        const delta = Math.max(0, Math.floor(amount || 0));
        if (delta) game._matchRewards.xp += delta;
    }
    if (game._classicXpActive && game.currentMode === 'classic') {
        const delta = Math.max(0, Math.floor(amount || 0));
        if (delta) game._classicMatchXp += delta;
    }
    if (game._blitzXpActive && game.currentMode === 'blitz') {
        const delta = Math.max(0, Math.floor(amount || 0));
        if (delta) game._blitzMatchXp += delta;
    }
    game.progression.addXP(amount, reason);
}

export function showLevelUpToast(game, snapshot) {
    if (!snapshot) return;

    const toast = document.createElement('div');
    toast.className = 'levelup-toast';
    const levelUpText = game.i18n ? game.i18n.t('progression.level_up') : 'Level up!';
    const levelUpIcon = snapshot.rankInfo?.avatar || '?';
    toast.innerHTML = `
            <div class="levelup-toast-title">${levelUpIcon} ${levelUpText}</div>
            <div class="levelup-toast-rank">${snapshot.rank} ${snapshot.levelRoman}</div>
        `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 200);
    }, 1500);
}

export function showRankUpModal(game, snapshot) {
    if (!snapshot || !snapshot.rankInfo) return;

    const modal = document.createElement('div');
    modal.className = 'rankup-modal';
    const rankUpText = game.i18n ? game.i18n.t('progression.rank_up') : 'NEW RANK';
    const continueText = game.i18n ? game.i18n.t('progression.continue') : 'Continue';
    const rankIcon = snapshot.rankInfo.avatar || '?';
    modal.innerHTML = `
            <div class="rankup-panel">
                <div class="rankup-emblem">${rankIcon}</div>
                <div class="rankup-title">${rankIcon} ${rankUpText}</div>
                <div class="rankup-name">${snapshot.rank.toUpperCase()}</div>
                <button class="rankup-btn" type="button">${continueText}</button>
            </div>
        `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('show'));

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector('.rankup-btn').addEventListener('click', closeModal);
}
