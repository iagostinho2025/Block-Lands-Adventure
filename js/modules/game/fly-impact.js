export function runFlyAnimation(game, r, c, key, emoji, onImpact = null) {
    const idx = r * 8 + c;
    const cells = game._boardCells || game.boardEl.children;
    const cell = cells[idx];
    if (!cell) {
        if (typeof onImpact === 'function') onImpact();
        return;
    }

    const startRect = cell.getBoundingClientRect();

    let targetEl = null;
    let isBossBarTarget = false;
    if (game.bossState.active) {
        if (game.shouldSyncBossDamageOnFlyImpact()) {
            targetEl =
                document.querySelector('#boss-hp-hud .boss-hp-bar-bg') ||
                document.querySelector('#boss-hp-hud .hp-bar-bg') ||
                document.querySelector('.boss-hp-bar-bg') ||
                document.querySelector('.hp-bar-bg') ||
                document.getElementById('boss-hp-bar-fill') ||
                document.getElementById('boss-hp-bar') ||
                document.getElementById('boss-hp-hud') ||
                document.getElementById('boss-hp-avatar') ||
                document.getElementById('boss-target');
            isBossBarTarget = !!targetEl && (
                targetEl.classList.contains('boss-hp-bar-bg') ||
                targetEl.classList.contains('hp-bar-bg') ||
                targetEl.id === 'boss-hp-bar-fill' ||
                targetEl.id === 'boss-hp-bar'
            );
        } else {
            targetEl = document.getElementById('boss-hp-avatar') || document.getElementById('boss-target');
        }
    } else {
        targetEl = document.getElementById(`goal-item-${key}`);
    }
    if (!targetEl) {
        if (typeof onImpact === 'function') onImpact();
        return;
    }

    const targetRect = targetEl.getBoundingClientRect();
    const flyer = game._acquireFlyer(emoji, key);
    flyer.classList.add('flying-item');
    flyer.style.position = 'fixed';
    flyer.style.zIndex = '9999';
    flyer.style.pointerEvents = 'none';
    flyer.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)';
    flyer.style.transformOrigin = 'center';
    flyer.style.opacity = '1';

    const startX = startRect.left + startRect.width / 4;
    const startY = startRect.top + startRect.height / 4;

    const bossImpactOffsetX = (game.bossState?.active && !isBossBarTarget) ? 63 : 0;
    const bossImpactOffsetY = game.bossState?.active ? 0 : 0;
    const destX = targetRect.left + targetRect.width / 2 - 20 + bossImpactOffsetX;
    const destY = targetRect.top + targetRect.height / 2 - 20 + bossImpactOffsetY;

    flyer.style.left = '0px';
    flyer.style.top = '0px';
    flyer.style.transform = `translate3d(${startX}px, ${startY}px, 0) scale(1.5)`;

    if (!flyer.parentNode) {
        document.body.appendChild(flyer);
    }

    let raf1 = 0;
    let raf2 = 0;
    let timer = 0;
    let released = false;

    const finish = () => {
        if (released) return;
        released = true;
        game._releaseFlyer(flyer);
        if (typeof onImpact === 'function') {
            try {
                onImpact();
            } catch (e) {
                console.warn('Impact callback error', e);
            }
        }
        const impactEl = game.getBossImpactTarget(targetEl);
        game.triggerPop(impactEl);
    };

    const cancel = () => {
        if (raf1) cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
        if (timer) clearTimeout(timer);
        finish();
    };

    game._flyerAnimCancel.set(flyer, { cancel });

    raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
            flyer.style.transform = `translate3d(${destX}px, ${destY}px, 0) scale(0.8)`;
        });
    });

    timer = setTimeout(() => {
        game._flyerAnimCancel.delete(flyer);
        finish();
    }, 1200);
}

export function shouldSyncBossDamageOnFlyImpact(game) {
    if (game.currentMode !== 'adventure' || !game.bossState?.active) return false;
    return !!game.getFireBossOverlayConfig();
}

export function hasPendingBossResolution(game) {
    return !!(
        (game._pendingSyncedBossImpacts || 0) > 0 ||
        (game._pendingBossDamage || 0) > 0 ||
        game._bossDamageRaf ||
        game._bossWinScheduled
    );
}

export function flushDeferredBossPostChecks(game, deps = {}) {
    const bossLogic = deps.bossLogic || {};
    if (game._resultResolved) return;
    if (!game.bossState?.active) {
        game._postImpactMoveCheckNeeded = false;
        game._postImpactBossTurnEndNeeded = false;
        return;
    }
    if (game.hasPendingBossResolution()) return;
    if (game.bossState.currentHp <= 0) return;

    if (game._postImpactBossTurnEndNeeded) {
        game._postImpactBossTurnEndNeeded = false;
        const bossId = game.currentLevelConfig?.boss?.id;
        if (bossLogic && bossLogic[bossId] && bossLogic[bossId].onTurnEnd) {
            bossLogic[bossId].onTurnEnd(game);
        }
    }

    if (game._resultResolved) return;
    if (game._postImpactMoveCheckNeeded) {
        game._postImpactMoveCheckNeeded = false;
        if (!game.checkMovesAvailable()) game.gameOver();
    }
}

export function beginSyncedBossImpact(game) {
    game._pendingSyncedBossImpacts = (game._pendingSyncedBossImpacts || 0) + 1;
}

export function completeSyncedBossImpact(game) {
    game._pendingSyncedBossImpacts = Math.max(0, (game._pendingSyncedBossImpacts || 0) - 1);
    game.flushDeferredBossPostChecks();
}

export function getBossImpactTarget(game, targetEl) {
    if (game.bossState?.active && game.getFireBossOverlayConfig() && game._ignisOverlayImgEl) {
        return game._ignisOverlayImgEl;
    }
    return targetEl;
}

export function triggerPop(game, el) {
    if (!el) return;
    if (!game._popTimers) game._popTimers = new WeakMap();

    const prevTimer = game._popTimers.get(el);
    if (prevTimer) clearTimeout(prevTimer);

    game.restartCssAnimationClass(el, 'hit-pop');

    const timer = setTimeout(() => {
        el.classList.remove('hit-pop');
        game._popTimers.delete(el);
    }, 220);
    game._popTimers.set(el, timer);
}
