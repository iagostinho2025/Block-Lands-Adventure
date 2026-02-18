export function renderHeroUI(game) {
    const oldContainer = document.getElementById('hero-powers-area');
    if (oldContainer) oldContainer.remove();

    if (game.currentMode !== 'adventure') return;

    const container = document.createElement('div');
    container.id = 'hero-powers-area';
    container.className = 'hero-powers-container';

    const thalionBtn = document.createElement('div');
    thalionBtn.id = 'btn-hero-thalion';
    thalionBtn.innerHTML = `\u{1F9DD}\u{200D}\u{2642}\u{FE0F}<div class="hero-badge">Combo x2</div>`;
    thalionBtn.onclick = () => game.activateHeroPower('thalion');

    const nyxBtn = document.createElement('div');
    nyxBtn.id = 'btn-hero-nyx';
    nyxBtn.innerHTML = `\u{1F43A}<div class="hero-badge">Combo x3</div>`;
    nyxBtn.onclick = () => game.activateHeroPower('nyx');

    container.appendChild(thalionBtn);
    container.appendChild(nyxBtn);

    const dock = document.getElementById('dock');
    if (dock && dock.parentNode) {
        dock.parentNode.insertBefore(container, dock);
    }

    game.updateHeroButtonsUI();
}

export function activateHeroPower(game, hero) {
    const state = game.heroState[hero];
    if (state.used || !state.unlocked) {
        if (game.audio) game.audio.vibrate(50);
        return;
    }
    if (game.interactionMode === `hero_${hero}`) {
        game.interactionMode = null;
        game.updateControlsVisuals();
        return;
    }

    game.interactionMode = `hero_${hero}`;
    if (game.audio) game.audio.playClick();
    game.updateControlsVisuals();

    let msg = game.i18n.t('game.aim_single');
    if (hero === 'thalion') msg = game.i18n.t('game.aim_thalion');
    if (hero === 'nyx') msg = game.i18n.t('game.aim_nyx');
    if (hero === 'player') msg = game.i18n.t('game.aim_player');
    if (hero === 'mage') msg = game.i18n.t('game.aim_mage');

    game.effects.showFloatingTextCentered(msg, 'feedback-gold');
}

export function updateHeroButtonsUI(game) {
    ['thalion', 'nyx'].forEach((hero) => {
        const btn = document.getElementById(`btn-hero-${hero}`);
        if (!btn) return;

        btn.className = 'hero-btn';
        const state = game.heroState[hero];

        if (state.used) {
            btn.classList.add('used');
        } else if (state.unlocked) {
            btn.classList.add('ready');
        } else {
            btn.classList.add('locked');
        }

        if (game.interactionMode === `hero_${hero}`) {
            btn.classList.add('active-aim');
        }
    });
}
