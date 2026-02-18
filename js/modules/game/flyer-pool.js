export function ensureFlyerPool(game) {
    if (game._flyerPool) return;

    game._flyerPool = [];
    game._flyerPoolBusy = new Set();
    game._flyerAnimCancel = new Map();

    const poolSize = 16;
    for (let i = 0; i < poolSize; i++) {
        const flyer = document.createElement('div');
        flyer.className = 'flying-item';
        flyer.style.position = 'fixed';
        flyer.style.left = '0px';
        flyer.style.top = '0px';
        flyer.style.zIndex = '9999';
        flyer.style.pointerEvents = 'none';
        flyer.style.opacity = '0';
        game._flyerPool.push(flyer);
    }
}

export function getFlySpritePathByKey(game, key) {
    return game.getItemSpritePathByKey(key);
}

export function getItemSpritePathByKey(_game, key, deps = {}) {
    const spritePaths = deps.spritePaths || {};
    const normalized = String(key || '').toLowerCase();
    return spritePaths[normalized] || '';
}

export function acquireFlyer(game, emoji, key = '') {
    game.ensureFlyerPool();
    const spritePath = game.getFlySpritePathByKey(key);

    for (const flyer of game._flyerPool) {
        if (!game._flyerPoolBusy.has(flyer)) {
            game._flyerPoolBusy.add(flyer);
            if (spritePath) {
                flyer.innerText = '';
                flyer.style.width = '40px';
                flyer.style.height = '40px';
                flyer.style.backgroundImage = `url('${spritePath}')`;
                flyer.style.backgroundRepeat = 'no-repeat';
                flyer.style.backgroundPosition = 'center';
                flyer.style.backgroundSize = 'contain';
                flyer.style.fontSize = '0';
                flyer.style.textShadow = 'none';
            } else {
                flyer.innerText = emoji;
                flyer.style.width = '';
                flyer.style.height = '';
                flyer.style.backgroundImage = 'none';
                flyer.style.backgroundRepeat = '';
                flyer.style.backgroundPosition = '';
                flyer.style.backgroundSize = '';
                flyer.style.fontSize = '';
                flyer.style.textShadow = '';
            }
            return flyer;
        }
    }

    const extra = document.createElement('div');
    extra.className = 'flying-item';
    extra.style.position = 'fixed';
    extra.style.left = '0px';
    extra.style.top = '0px';
    extra.style.zIndex = '9999';
    extra.style.pointerEvents = 'none';
    extra.style.opacity = '0';
    if (spritePath) {
        extra.innerText = '';
        extra.style.width = '40px';
        extra.style.height = '40px';
        extra.style.backgroundImage = `url('${spritePath}')`;
        extra.style.backgroundRepeat = 'no-repeat';
        extra.style.backgroundPosition = 'center';
        extra.style.backgroundSize = 'contain';
        extra.style.fontSize = '0';
        extra.style.textShadow = 'none';
    } else {
        extra.innerText = emoji;
    }

    game._flyerPool.push(extra);
    game._flyerPoolBusy.add(extra);
    return extra;
}

export function releaseFlyer(game, flyer) {
    const anim = game._flyerAnimCancel.get(flyer);
    if (anim && anim.cancel) anim.cancel();
    game._flyerAnimCancel.delete(flyer);

    flyer.style.opacity = '0';
    flyer.style.transform = 'translate3d(0px,0px,0) scale(1)';
    if (flyer.parentNode) flyer.parentNode.removeChild(flyer);

    game._flyerPoolBusy.delete(flyer);
}
