import { WORLDS } from '../data/levels.js';

export function showWorldSelect(game) {
    game.preloadDeferredAssets('world_select');
    const container = document.getElementById('levels-container');

    if (container) {
        container.style = '';
        container.style.backgroundImage = "url('assets/img/bg_world_select.webp')";
        container.className = 'world-select-layout';
    }

    game.showScreen(game.screenLevels);
    game.toggleGlobalHeader(false);

    if (!container) return;

    container.innerHTML = `
            <div class="buttons-sticky-header">
                <button id="btn-world-back-internal" class="btn-aaa-back pos-absolute-top-left">
                    <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                </button>
                
                <button id="btn-replay-story" class="btn-aaa-back" style="position: absolute; top: 20px; right: 20px;">
                    <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                </button>
            </div>
            <div class="worlds-grid" id="worlds-grid"></div>
        `;

    const backBtn = document.getElementById('btn-world-back-internal');
    if (backBtn) {
        backBtn.onclick = (e) => {
            e.preventDefault();
            if (game.audio) game.audio.playBack();
            container.className = '';
            container.style.backgroundImage = '';
            game.showScreen(game.screenMenu);
        };
    }

    const replayBtn = document.getElementById('btn-replay-story');
    if (replayBtn) {
        replayBtn.onclick = () => {
            if (game.audio) game.audio.playClick();
            game.playStory({ includeAfter: true });
        };
    }

    const grid = document.getElementById('worlds-grid');
    const currentSave = game.loadProgress();

    const worldImages = {
        'tutorial_world': 'assets/img/icon_world_tutorial.webp',
        'fire_world': 'assets/img/icon_world_fire.webp',
        'forest_world': 'assets/img/icon_world_forest.webp',
        'mountain_world': 'assets/img/icon_world_mountain.webp',
        'desert_world': 'assets/img/icon_world_desert.webp',
        'castle_world': 'assets/img/icon_world_castle.webp'
    };

    WORLDS.forEach((world) => {
        const worldItem = document.createElement('div');
        worldItem.style.position = 'absolute';
        const pos = world.worldPos || { x: 50, y: 50 };
        worldItem.style.left = pos.x + '%';
        worldItem.style.top = pos.y + '%';
        worldItem.style.transform = 'translate(-50%, -50%)';
        worldItem.style.display = 'flex';
        worldItem.style.flexDirection = 'column';
        worldItem.style.alignItems = 'center';
        worldItem.style.zIndex = '10';

        let firstLevelId = world.levels[0].id;
        const isLocked = currentSave < firstLevelId;

        if (world.id === 'tutorial_world' && currentSave === 0) {
            const hand = document.createElement('div');
            hand.className = 'tutorial-hand';
            hand.innerHTML = '\u{1F446}';
            worldItem.appendChild(hand);
        }

        const img = document.createElement('img');
        img.src = worldImages[world.id] || 'assets/img/icon_world_fire.webp';
        img.alt = world.name;
        img.className = 'world-card-image';
        if (world.worldSize) img.style.width = world.worldSize + 'px';
        if (isLocked) img.classList.add('locked');

        img.addEventListener('click', () => {
            if (!isLocked) {
                if (game.audio) game.audio.playClick();
                if (world.id === 'tutorial_world') {
                    game.toggleGlobalHeader(true);
                    const levelsContainer = document.getElementById('levels-container');
                    if (levelsContainer) levelsContainer.style.display = 'none';
                    document.body.className = '';
                    game.startAdventureLevel(world.levels[0]);
                } else {
                    game.openWorldMap(world);
                }
            } else {
                if (game.audio) game.audio.vibrate(50);
                game.effects.showFloatingTextCentered(game.i18n.t('worlds.locked_msg'), 'feedback-bad');
            }
        });

        worldItem.appendChild(img);
        if (isLocked) {
            const lock = document.createElement('div');
            lock.className = 'lock-overlay';
            lock.innerHTML = '\u{1F512}';
            worldItem.appendChild(lock);
        }
        if (grid) grid.appendChild(worldItem);
    });
}

export function setWorldMapBackground(game, mapElement, worldConfig) {
    if (!mapElement) return;
    const fallback = 'assets/img/bg_world_select.webp';
    const preferred = worldConfig?.bgImage || fallback;

    mapElement.style.backgroundImage = `url('${fallback}')`;

    if (!preferred || preferred === fallback) return;

    game.preloadImage(preferred).then((ok) => {
        if (ok) {
            mapElement.style.backgroundImage = `url('${preferred}')`;
        }
    });
}
