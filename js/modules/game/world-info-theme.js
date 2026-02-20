import { WORLDS } from '../data/levels.js';

export function updateClassicThemeClass(game, deps = {}) {
    const {
        classicThemeClasses = [],
        classicDefaultTheme = 'default',
        classicThemeStorageKey = 'blocklands_classic_theme'
    } = deps;

    const app = document.getElementById('app');
    if (!app) return;

    app.classList.remove(...classicThemeClasses);

    let themeId = game.classicTheme || classicDefaultTheme;
    if (!classicThemeClasses.includes(`classic-theme-${themeId}`)) {
        themeId = classicDefaultTheme;
        game.classicTheme = themeId;
        localStorage.setItem(classicThemeStorageKey, themeId);
    }
    app.classList.add(`classic-theme-${themeId}`);
}

export function setClassicTheme(game, themeId, deps = {}) {
    const {
        classicThemeClasses = [],
        classicThemeStorageKey = 'blocklands_classic_theme'
    } = deps;

    if (!themeId) return;
    if (!classicThemeClasses.includes(`classic-theme-${themeId}`)) return;

    game.classicTheme = themeId;
    localStorage.setItem(classicThemeStorageKey, themeId);

    game.updateClassicThemeClass();
    game.updateStoreUnlockablesUI();
}

export function handleUnlockableSelection(game, unlockableId, deps = {}) {
    const { classicThemeUnlockables = {} } = deps;
    const themeId = classicThemeUnlockables[unlockableId];
    if (!themeId) return;

    if (game.audio) game.audio.playClick();
    game.setClassicTheme(themeId);

    game.showStoreToast('\u{1F3A8} Tema aplicado', 'success');
}

export function updateStoreUnlockablesUI(game, deps = {}) {
    const { classicThemeUnlockables = {} } = deps;

    const unlockables = document.querySelectorAll('.store-item[data-unlockable-id]');
    if (!unlockables || unlockables.length === 0) return;

    unlockables.forEach((card) => {
        const unlockableId = card.getAttribute('data-unlockable-id');
        const themeId = classicThemeUnlockables[unlockableId];
        if (!themeId) return;

        const isActive = themeId === game.classicTheme;
        card.classList.toggle('featured', isActive);

        const badgeSpan = card.querySelector('.featured-badge span');
        if (badgeSpan) badgeSpan.textContent = isActive ? 'ATIVO' : 'NOVO';

        const btn = card.querySelector('.btn-buy');
        if (btn) {
            btn.disabled = isActive;
            btn.textContent = isActive ? 'Ativo' : 'Usar';
            btn.setAttribute('data-unlockable-id', unlockableId);
        }
    });
}

export function updateWorldClass(game, deps = {}) {
    const { runtimeLogs = false, debugBossHud = false } = deps;

    const app = document.getElementById('app');
    if (!app) return;

    app.classList.remove(
        'world-guardian',
        'world-fire',
        'world-forest',
        'world-mountain',
        'world-desert',
        'world-castle',
        'theme-fire-elite',
        'level-forest-elite-10',
        'level-fire-boss-20',
        'level-fire-elite-10',
        'level-fire-elite-15'
    );

    app.classList.remove(
        'level-type-normal',
        'level-type-elite',
        'level-type-boss'
    );

    if (game.currentMode !== 'adventure' || !game.currentLevelConfig) {
        if (runtimeLogs) console.log('[WORLD-CLASS] Não é modo aventura ou sem levelConfig. currentMode:', game.currentMode);
        return;
    }

    const currentWorld = WORLDS.find((w) => w.levels.some((l) => l.id === game.currentLevelConfig.id));
    if (!currentWorld) {
        console.warn('[WORLD-CLASS] Mundo não encontrado para level:', game.currentLevelConfig.id);
        return;
    }

    const worldClassMap = {
        tutorial_world: 'world-guardian',
        fire_world: 'world-fire',
        forest_world: 'world-forest',
        mountain_world: 'world-mountain',
        desert_world: 'world-desert',
        castle_world: 'world-castle'
    };

    const worldClass = worldClassMap[currentWorld.id];
    if (worldClass) {
        app.classList.add(worldClass);
    }

    const levelType = game.currentLevelConfig.type || 'normal';
    let levelTypeClass = 'level-type-normal';
    const eliteLevelIds = new Set([10, 15, 30, 35, 50, 55, 70, 75, 90, 95]);

    if (levelType === 'boss') {
        const levelId = game.currentLevelConfig.id;
        if (eliteLevelIds.has(levelId)) {
            levelTypeClass = 'level-type-elite';
        } else {
            levelTypeClass = 'level-type-boss';
        }
    }

    app.classList.add(levelTypeClass);
    const isFireElite = currentWorld.id === 'fire_world' && levelTypeClass === 'level-type-elite';
    if (isFireElite) {
        app.classList.add('theme-fire-elite');
    }
    if (debugBossHud && game.currentLevelConfig) {
        console.log('[ELITE-FIRE] root classes:', app.className, '| world:', currentWorld.id, '| level:', game.currentLevelConfig.id);
    }

    if (isFireElite) {
        game.ensureBoardFrameOnBoard();
    } else {
        game.removeBoardFrameFromBoard();
    }

    if (currentWorld.id === 'forest_world' && game.currentLevelConfig.id === 30) {
        app.classList.add('level-forest-elite-10');
    }
    if (currentWorld.id === 'fire_world' && game.currentLevelConfig.id === 20) {
        app.classList.add('level-fire-boss-20');
    }
    if (currentWorld.id === 'fire_world' && game.currentLevelConfig.id === 10) {
        app.classList.add('level-fire-elite-10');
    }
    if (currentWorld.id === 'fire_world' && game.currentLevelConfig.id === 15) {
        app.classList.add('level-fire-elite-15');
    }

    if (runtimeLogs) {
        console.log('[WORLD-CLASS] classes aplicadas:', worldClass, '+', levelTypeClass, '| Mundo:', currentWorld.name, '| #app classes:', app.className);
    }
}

export function getInfoCardId(game) {
    if (game.currentMode !== 'adventure' || !game.currentLevelConfig) return null;
    const levelId = game.currentLevelConfig.id;
    const currentWorld = WORLDS.find((w) => w.levels.some((l) => l.id === levelId));
    if (!currentWorld) return null;

    if (currentWorld.id === 'tutorial_world' && levelId === 0) return 'guardian';
    if (currentWorld.id === 'fire_world') {
        if (levelId === 10) return 'fire_elite_10';
        if (levelId === 15) return 'fire_elite_15';
        if (levelId === 20) return 'fire_boss_20';
    }
    if (currentWorld.id === 'forest_world') {
        if (levelId === 30) return 'forest_elite_30';
        if (levelId === 35) return 'forest_elite_35';
        if (levelId === 40) return 'forest_boss_40';
    }
    if (currentWorld.id === 'mountain_world') {
        if (levelId === 50) return 'mountain_elite_50';
        if (levelId === 55) return 'mountain_elite_55';
        if (levelId === 60) return 'mountain_boss_60';
    }
    if (currentWorld.id === 'desert_world') {
        if (levelId === 70) return 'desert_elite_70';
        if (levelId === 75) return 'desert_elite_75';
        if (levelId === 80) return 'desert_boss_80';
    }
    if (currentWorld.id === 'castle_world') {
        if (levelId === 90) return 'castle_elite_90';
        if (levelId === 95) return 'castle_elite_95';
        if (levelId === 100) return 'castle_boss_100';
    }
    return null;
}

export function updateInfoHelpIcon(game) {
    const helpBtn = document.getElementById('game-info-btn');
    if (!helpBtn) return;
    const shouldShow = !!game.getInfoCardId();
    helpBtn.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    if (!shouldShow) game.closeInfoCard();
}

export function renderInfoCard(game, infoId, deps = {}) {
    const { infoCardData = {} } = deps;

    const info = infoCardData[infoId];
    if (!info || !game.i18n) return;
    const overlay = document.getElementById('guardian-info-overlay');
    const card = overlay?.querySelector('.guardian-info-card');
    if (overlay) overlay.dataset.infoId = infoId;
    if (card) card.dataset.infoId = infoId;

    const titleEl = document.getElementById('guardian-info-title');
    const subtitleEl = document.getElementById('guardian-info-subtitle');
    if (titleEl) titleEl.textContent = game.i18n.t(info.titleKey);
    if (subtitleEl) subtitleEl.textContent = game.i18n.t(info.subtitleKey);

    const sealImg = document.getElementById('guardian-info-seal');
    if (sealImg && info.sealImage) {
        if (info.sealAltKey) sealImg.alt = game.i18n.t(info.sealAltKey);
        sealImg.dataset.fallbackSrc = info.sealFallback || '';
        const requestId = String((game._infoSealRequestSeq = (game._infoSealRequestSeq || 0) + 1));
        sealImg.dataset.requestId = requestId;
        sealImg.style.visibility = 'hidden';
        sealImg.onerror = () => {
            if (sealImg.dataset.requestId !== requestId) return;
            const fallback = sealImg.dataset.fallbackSrc;
            if (fallback && sealImg.src.indexOf(fallback) === -1) {
                sealImg.src = fallback;
                return;
            }
            sealImg.style.visibility = '';
        };
        sealImg.onload = () => {
            if (sealImg.dataset.requestId !== requestId) return;
            sealImg.style.visibility = '';
        };
        sealImg.src = info.sealImage;
    }

    const renderIcon = (item) => {
        if (item.iconImage) {
            const altText = item.iconAlt || '';
            return `<img class="scroll-icon-img" src="${item.iconImage}" alt="${altText}" loading="lazy" decoding="async">`;
        }
        return item.icon || '';
    };

    const makeItem = (item) => `
            <div class="scroll-item">
                <span class="scroll-icon">${renderIcon(item)}</span>
                <div>
                    <div class="scroll-item-title">${game.i18n.t(item.titleKey)}</div>
                    <div class="scroll-item-desc">${game.i18n.t(item.descKey)}</div>
                </div>
            </div>`;

    const bossList = document.getElementById('guardian-info-boss-list');
    if (bossList) bossList.innerHTML = info.bossPowers.map(makeItem).join('');

    const itemsList = document.getElementById('guardian-info-items-list');
    if (itemsList) itemsList.innerHTML = info.items.map(makeItem).join('');

    const storyWrap = document.getElementById('guardian-info-story-wrap');
    const storyEl = document.getElementById('guardian-info-story');
    if (storyWrap && storyEl) {
        if (info.storyKey) {
            storyEl.textContent = game.i18n.t(info.storyKey);
            storyWrap.classList.remove('hidden');
        } else {
            storyEl.textContent = '';
            storyWrap.classList.add('hidden');
        }
    }
}

export function openInfoCard(game) {
    const infoId = game.getInfoCardId();
    if (!infoId) return;
    game.renderInfoCard(infoId);
    const overlay = document.getElementById('guardian-info-overlay');
    if (!overlay) return;
    game._infoCardLastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    game._infoCardOpen = true;
    game.teardownIgnisSpriteOverlay();
    overlay.classList.remove('hidden');
    overlay.inert = false;
    overlay.setAttribute('aria-hidden', 'false');
    const closeBtn = overlay.querySelector('#guardian-info-close');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            if (game.audio) game.audio.playClick();
            game.closeInfoCard();
        };
        closeBtn.focus();
    }
}

export function closeInfoCard(game) {
    const overlay = document.getElementById('guardian-info-overlay');
    if (!overlay) return;
    const lastFocus = game._infoCardLastFocus;
    if (overlay.contains(document.activeElement)) {
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
        else overlay.blur?.();
    }
    overlay.classList.add('hidden');
    overlay.inert = true;
    overlay.setAttribute('aria-hidden', 'true');
    game._infoCardOpen = false;
    game.updateIgnisBossUiOverride();
}

export function maybeShowInfoCard(game) {
    const infoId = game.getInfoCardId();
    if (!infoId) return;
    const seenKey = `blocklands_info_seen_${infoId}`;
    if (localStorage.getItem(seenKey) === 'true') return;
    localStorage.setItem(seenKey, 'true');
    game.openInfoCard();
}
