export function preloadImage(game, src) {
    if (!src) return Promise.resolve(false);
    if (!game._preloadedImages) game._preloadedImages = new Set();
    if (!game._imagePreloadPromises) game._imagePreloadPromises = new Map();
    if (game._preloadedImages.has(src)) return Promise.resolve(true);
    if (game._imagePreloadPromises.has(src)) return game._imagePreloadPromises.get(src);

    const promise = new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
        img.onload = () => {
            game._preloadedImages.add(src);
            game._imagePreloadPromises.delete(src);
            resolve(true);
        };
        img.onerror = () => {
            console.warn(`Falha ao carregar: ${src}`);
            game._imagePreloadPromises.delete(src);
            resolve(false);
        };
    });
    game._imagePreloadPromises.set(src, promise);
    return promise;
}

export function preloadImageList(game, list = []) {
    const items = Array.isArray(list) ? Array.from(new Set(list.filter(Boolean))) : [];
    if (items.length === 0) return Promise.resolve();
    return Promise.all(items.map((src) => game.preloadImage(src))).then(() => undefined);
}

export function preloadDeferredAssets(game, scope = 'background_all') {
    const groups = {
        world_select: [
            'assets/img/map_fire.webp',
            'assets/img/map_forest.webp',
            'assets/img/map_mountain.webp',
            'assets/img/map_desert.webp',
            'assets/img/map_castle.webp',
            'assets/img/bg_world_select.webp',
            'assets/img/icon_world_tutorial.webp',
            'assets/img/icon_world_fire.webp',
            'assets/img/icon_world_forest.webp',
            'assets/img/icon_world_desert.webp',
            'assets/img/icon_world_castle.webp',
            'assets/img/icon_world_mountain.webp'
        ],
        story_intro: [
            'assets/img/thalion_story_1.webp',
            'assets/img/thalion_story_2.webp',
            'assets/img/thalion_story_3.webp',
            'assets/img/thalion_story_4.webp',
            'assets/img/thalion_story_5.webp',
            'assets/img/thalion_story_6.webp'
        ],
        story_after: [
            'assets/img/story_guardian_gate_opening.webp',
            'assets/img/story_fire_ignis_aftermath.webp',
            'assets/img/story_forest_aracna_aftermath.webp',
            'assets/img/story_mountain_golem_aftermath.webp',
            'assets/img/story_desert_grok_aftermath.webp',
            'assets/img/story_castle_dark_wizard_aftermath.webp'
        ],
        adventure_boss_assets: [
            // Enemy sprites used in boss/elite HUD + info cards
            'assets/enemies/guardian/boss.webp',
            'assets/enemies/fire_world/elite_10.webp',
            'assets/enemies/fire_world/elite_15.webp',
            'assets/enemies/fire_world/boss.webp',
            'assets/enemies/forest_world/elite_10.webp',
            'assets/enemies/forest_world/elite_15.webp',
            'assets/enemies/forest_world/boss.webp',
            'assets/enemies/mountain_world/elite_10.webp',
            'assets/enemies/mountain_world/elite_15.webp',
            'assets/enemies/mountain_world/boss.webp',
            'assets/enemies/desert_world/elite_10.webp',
            'assets/enemies/desert_world/elite_15.webp',
            'assets/enemies/desert_world/boss.webp',
            'assets/enemies/castle_world/elite_10.webp',
            'assets/enemies/castle_world/elite_15.webp',
            'assets/enemies/castle_world/boss.webp',

            // World arts shown around elite/boss context
            'assets/backgrounds/guardian/boss.webp',
            'assets/backgrounds/fire/elite.webp',
            'assets/backgrounds/fire/boss.webp',
            'assets/backgrounds/forest/elite.webp',
            'assets/backgrounds/forest/boss.webp',
            'assets/backgrounds/mountain/elite.webp',
            'assets/backgrounds/mountain/boss.webp',
            'assets/backgrounds/desert/elite.webp',
            'assets/backgrounds/desert/boss.webp',
            'assets/backgrounds/castle/elite.webp',
            'assets/backgrounds/castle/boss.webp'
        ]
    };

    const all = [
        ...groups.world_select,
        ...groups.story_intro,
        ...groups.story_after,
        ...groups.adventure_boss_assets
    ];
    const targets = scope === 'background_all' ? all : (groups[scope] || []);
    if (targets.length === 0) return;

    const run = () => { game.preloadImageList(targets); };

    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(() => { run(); }, { timeout: 2000 });
    } else {
        setTimeout(() => { run(); }, 250);
    }
}

export function loadPowerUps(game, deps = {}) {
    const maxPowerupCount = deps.maxPowerupCount || 3;
    const rawMagnet = parseInt(localStorage.getItem('blocklands_powerup_magnet') || '0', 10);
    const rawRotate = parseInt(localStorage.getItem('blocklands_powerup_rotate') || '0', 10);
    const rawSwap = parseInt(localStorage.getItem('blocklands_powerup_swap') || '0', 10);

    game.powerUps.magnet = Math.min(rawMagnet, maxPowerupCount);
    game.powerUps.rotate = Math.min(rawRotate, maxPowerupCount);
    game.powerUps.swap = Math.min(rawSwap, maxPowerupCount);
    console.log('[POWERUPS] Carregados:', game.powerUps);
    game.updateControlsVisuals();
    if (rawMagnet !== game.powerUps.magnet || rawRotate !== game.powerUps.rotate || rawSwap !== game.powerUps.swap) {
        game.savePowerUps();
    }
}

export function savePowerUps(game) {
    localStorage.setItem('blocklands_powerup_magnet', game.powerUps.magnet);
    localStorage.setItem('blocklands_powerup_rotate', game.powerUps.rotate);
    localStorage.setItem('blocklands_powerup_swap', game.powerUps.swap);
    console.log('[POWERUPS] Salvos:', game.powerUps);
    game.updateControlsVisuals();
}
