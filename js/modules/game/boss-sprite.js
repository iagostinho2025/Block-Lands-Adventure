import { WORLDS } from '../data/levels.js';

export function getCurrentWorld(game) {
    if (!game.currentLevelConfig) return null;

    const world = WORLDS.find((w) => w.levels.some((l) => l.id === game.currentLevelConfig.id));
    return world ? world.id.replace('_world', '') : null;
}

export function getCurrentWorldConfig(game) {
    if (!game.currentLevelConfig) return null;
    return WORLDS.find((w) => w.levels.some((l) => l.id === game.currentLevelConfig.id)) || null;
}

export function applyBossSprite(game, avatarElement) {
    if (!avatarElement) return;
    if (game.currentMode !== 'adventure' || !game.currentLevelConfig) return;

    const worldConfig = game.getCurrentWorldConfig();
    if (!worldConfig) return;

    let spriteId = null;
    if (window.enemySpriteSystem && typeof window.enemySpriteSystem.getSpriteId === 'function') {
        spriteId = window.enemySpriteSystem.getSpriteId(
            worldConfig.id,
            game.currentLevelConfig.id,
            game.currentLevelConfig.type
        );
    }

    if (!spriteId) {
        const worldMap = {
            tutorial_world: 'guardian',
            fire_world: 'fire',
            forest_world: 'forest',
            mountain_world: 'mountain',
            desert_world: 'desert',
            castle_world: 'castle'
        };
        const worldFolder = worldMap[worldConfig.id] || 'guardian';
        const levelNumber = game.currentLevelConfig.id;
        const levelType = game.currentLevelConfig.type;
        if (levelType === 'boss' || levelNumber === 20) {
            spriteId = `${worldFolder}_boss`;
        } else if (levelNumber === 10) {
            spriteId = `${worldFolder}_elite_10`;
        } else if (levelNumber === 15) {
            spriteId = `${worldFolder}_elite_15`;
        } else {
            spriteId = `${worldFolder}_elite_${levelNumber}`;
        }
    }

    const worldMatch = spriteId.match(/^([a-z]+)_/);
    const world = worldMatch ? worldMatch[1] : 'guardian';
    const fileName = spriteId.replace(`${world}_`, '');
    const folder = world === 'guardian' ? 'guardian' : `${world}_world`;
    const pathWebP = `assets/enemies/${folder}/${fileName}.webp`;
    const pathPng = `assets/enemies/${folder}/${fileName}.png`;

    const applySprite = (path) => {
        const resolvedPath = new URL(path, window.location.href).toString();
        avatarElement.classList.add('boss-sprite');
        avatarElement.setAttribute('data-enemy-id', spriteId);
        avatarElement.style.setProperty('background-image', `url('${resolvedPath}')`, 'important');
        avatarElement.style.setProperty('--boss-sprite-url', `url('${resolvedPath}')`);
        avatarElement.style.setProperty('background-repeat', 'no-repeat', 'important');
        avatarElement.style.setProperty('background-position', '50% 60%', 'important');
        let bgSize = '88%';
        const fireOverlayCfg = game.getFireBossOverlayConfig();
        if (fireOverlayCfg) {
            bgSize = '180%';
        }
        avatarElement.style.setProperty('background-size', bgSize, 'important');
        avatarElement.style.setProperty('background-color', 'transparent', 'important');
        if (fireOverlayCfg) {
            game.updateIgnisBossUiOverride();
            game.syncIgnisSpriteOverlay();
        }
    };

    const imgWebP = new Image();
    imgWebP.onload = () => applySprite(pathWebP);
    imgWebP.onerror = () => {
        const imgPng = new Image();
        imgPng.onload = () => applySprite(pathPng);
        imgPng.onerror = () => {
            // fallback: keeps emoji if sprite fails
        };
        imgPng.src = pathPng;
    };
    imgWebP.src = pathWebP;
}

export function applyGuardianBossSprite(game, avatarElement) {
    game.applyBossSprite(avatarElement);
}
