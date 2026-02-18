export function setupBossUI(game, bossData, options = {}) {
    const debugBossHud = options.debugBossHud === true;
    if (!game.goalsArea) return;

    game.goalsArea.innerHTML = `
        <div class="boss-ui-container">
            <div id="boss-target" class="boss-avatar">${bossData.emoji}</div>
            <div class="boss-stats">
                <div class="boss-name">${bossData.name}</div>
                <div class="hp-bar-bg">
                    <div class="hp-bar-fill" id="boss-hp-bar" style="width: 100%"></div>
                    <span id="boss-hp-text" class="hp-text">${bossData.maxHp}/${bossData.maxHp}</span>
                </div>
            </div>
        </div>`;

    game._bossUI = null;
    const bossAvatar = document.getElementById('boss-target');
    game.applyBossSprite(bossAvatar);
    game.updateIgnisBossUiOverride();
    if (debugBossHud) {
        console.log('[HUD] Boss UI created. Fight type:', game.currentLevelConfig?.type || 'none');
    }
}

export function ensureBossHud(game, bossData, options = {}) {
    const debugBossHud = options.debugBossHud === true;
    const host = document.getElementById('screen-game');
    if (!host) return;

    let hud = document.getElementById('boss-hp-hud');
    const needsBuild = !hud
        || !hud.querySelector('#boss-hp-avatar')
        || !hud.querySelector('#boss-hp-name')
        || !hud.querySelector('#boss-hp-bar-fill')
        || !hud.querySelector('#boss-hp-hud-text');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'boss-hp-hud';
    }
    if (needsBuild) {
        hud.innerHTML = `
            <div class="boss-hp-row">
                <div class="boss-avatar" id="boss-hp-avatar"></div>
                <div class="boss-hp-wrapper">
                    <div class="boss-hp-name" id="boss-hp-name"></div>
                    <div class="boss-hp-bar-bg">
                        <div class="boss-hp-bar-fill" id="boss-hp-bar-fill" style="width: 100%"></div>
                        <span class="hp-text" id="boss-hp-hud-text"></span>
                    </div>
                </div>
            </div>`;
        if (debugBossHud) {
            console.log('[HUD] Boss HUD built/rebuilt. Fight type:', game.currentLevelConfig?.type || 'none');
        }
        game._bossHudRefs = null;
    }
    if (!hud.parentNode) host.insertBefore(hud, host.firstChild);

    const data = bossData || game.currentLevelConfig?.boss;
    if (!data) return;

    const refs = getBossHudRefs(game);
    if (!refs) return;
    const avatar = refs.avatar;
    const name = refs.name;
    const bar = refs.bar;
    if (avatar) avatar.textContent = data.emoji || '\u{1F409}';
    game.applyBossSprite(avatar);
    game.updateIgnisBossUiOverride();
    if (name) name.textContent = data.name || 'Boss';
    if (bar) bar.style.width = '100%';
    game._bossHudLastPct = '100%';

    if (game.goalsArea) game.goalsArea.style.display = 'none';
    refs.hud.style.display = 'block';
}

export function hideBossHud(game) {
    const refs = getBossHudRefs(game);
    if (refs?.hud) refs.hud.style.display = 'none';
    if (game.goalsArea) game.goalsArea.style.display = '';
    game._bossHudLastPct = null;
    game.teardownIgnisSpriteOverlay();
}

export function getBossHudRefs(game) {
    if (game._bossHudRefs?.hud && game._bossHudRefs.hud.isConnected) {
        return game._bossHudRefs;
    }

    const hud = document.getElementById('boss-hp-hud');
    if (!hud) return null;

    const refs = {
        hud,
        bar: hud.querySelector('#boss-hp-bar-fill'),
        name: hud.querySelector('#boss-hp-name'),
        avatar: hud.querySelector('#boss-hp-avatar'),
        text: hud.querySelector('#boss-hp-hud-text')
    };

    if (!refs.bar) return null;
    game._bossHudRefs = refs;
    return refs;
}

export function updateBossHud(game) {
    const refs = getBossHudRefs(game);
    if (!refs?.bar) return;
    const bar = refs.bar;
    const name = refs.name;
    const avatar = refs.avatar;
    const hud = refs.hud;

    const pct = (game.bossState.currentHp / game.bossState.maxHp) * 100;
    const pctStr = `${pct}%`;
    if (game._bossHudLastPct !== pctStr) {
        bar.style.width = pctStr;
        game._bossHudLastPct = pctStr;
    }
    if (hud) {
        hud.style.setProperty('--boss-hp-pct', pctStr);

        const prev = (typeof game._lastBossHp === 'number') ? game._lastBossHp : game.bossState.maxHp;
        if (game.bossState.currentHp < prev) {
            game.restartCssAnimationClass(hud, 'damage-flash');
            if (game._bossFlashTimer) clearTimeout(game._bossFlashTimer);
            game._bossFlashTimer = setTimeout(() => {
                hud.classList.remove('damage-flash');
            }, 180);

            hud.style.setProperty('--boss-hp-pct-lag', pctStr);
            game._bossHpLagPct = pct;
        } else if (game._bossHpLagPct == null) {
            hud.style.setProperty('--boss-hp-pct-lag', pctStr);
        }
    }
    if (game._bossHpLagPct == null) game._bossHpLagPct = pct;
    game._lastBossHp = game.bossState.currentHp;

    const data = game.currentLevelConfig?.boss;
    if (data) {
        if (name) name.textContent = data.name || name.textContent;
        if (avatar) avatar.textContent = data.emoji || avatar.textContent;
    }

    const text = refs.text;
    if (text) {
        const current = Math.ceil(game.bossState.currentHp);
        const newText = `${current}/${game.bossState.maxHp}`;
        if (text.textContent !== newText) text.textContent = newText;
    }
}
