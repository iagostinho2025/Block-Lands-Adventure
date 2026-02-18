export function updatePowerUpsUI(game) {
    ['magnet', 'rotate', 'swap'].forEach((type) => {
        const btn = document.getElementById(`btn-${type}`);
        if (!btn) return;

        const countEl = btn.querySelector('.count');
        if (countEl) countEl.textContent = game.powerUps[type] || 0;

        if ((game.powerUps[type] || 0) <= 0) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }

        if (game.interactionMode === type) {
            btn.classList.add('active-mode');
        } else {
            btn.classList.remove('active-mode');
        }
    });
}

export function activatePowerUp(game, type) {
    if (game.powerUps[type] <= 0) {
        if (game.audio) game.audio.vibrate(50);
        return;
    }
    if (game.interactionMode === type) {
        game.interactionMode = null;
        game.updateControlsVisuals();
        return;
    }
    if (type === 'swap') {
        if (game.audio) game.audio.playClick();
        game.powerUps.swap--;
        game.savePowerUps();
        game.spawnNewHand();
        game.effects.shakeScreen();
        game.renderControlsUI();
        game.powerUsedThisLevel = true;
        return;
    }
    game.interactionMode = type;
    if (game.audio) game.audio.playClick();
    game.updateControlsVisuals();
    game.powerUsedThisLevel = true;
}

export function renderControlsUI(game) {
    if (game.currentMode === 'classic' || game.currentMode === 'blitz') {
        const controlsBar = document.getElementById('controls-bar');
        if (controlsBar) controlsBar.style.display = 'none';
        return;
    }

    const oldPwr = document.getElementById('powerups-area');
    if (oldPwr) oldPwr.style.display = 'none';
    const oldHeroes = document.getElementById('hero-powers-area');
    if (oldHeroes) oldHeroes.remove();

    let controlsContainer = document.getElementById('controls-bar');
    if (!controlsContainer) {
        controlsContainer = document.createElement('div');
        controlsContainer.id = 'controls-bar';
        controlsContainer.className = 'controls-bar';
        if (game.dockEl && game.dockEl.parentNode) {
            game.dockEl.parentNode.insertBefore(controlsContainer, game.dockEl.nextSibling);
        } else {
            document.body.appendChild(controlsContainer);
        }
    } else {
        controlsContainer.style.display = '';
    }

    if (!game._controlsUI) {
        const leftGroup = document.createElement('div');
        leftGroup.className = 'controls-group';
        leftGroup.id = 'controls-left-group';

        const rightGroup = document.createElement('div');
        rightGroup.className = 'controls-group';
        rightGroup.id = 'controls-right-group';

        controlsContainer.innerHTML = '';
        controlsContainer.appendChild(leftGroup);
        controlsContainer.appendChild(rightGroup);

        game._controlsUI = {
            container: controlsContainer,
            leftGroup,
            rightGroup,
            pwrBtns: new Map(),
            pwrCounts: new Map(),
            heroBtns: new Map(),
            heroSignature: null
        };

        const pwrList = [
            { id: 'magnet', icon: '\u{1F9F2}' },
            { id: 'rotate', icon: '\u{1F504}' },
            { id: 'swap', icon: '\u{1F500}' }
        ];

        for (const p of pwrList) {
            const btn = document.createElement('button');
            btn.className = `ctrl-btn pwr-${p.id}`;
            btn.id = `btn-pwr-${p.id}`;
            btn.type = 'button';

            const iconSpan = document.createElement('span');
            iconSpan.className = 'ctrl-icon';
            iconSpan.textContent = p.icon;

            const countSpan = document.createElement('span');
            countSpan.className = 'ctrl-count';
            countSpan.textContent = '0';

            btn.appendChild(iconSpan);
            btn.appendChild(countSpan);
            btn.addEventListener('click', () => game.activatePowerUp(p.id));

            game._controlsUI.leftGroup.appendChild(btn);
            game._controlsUI.pwrBtns.set(p.id, btn);
            game._controlsUI.pwrCounts.set(p.id, countSpan);
        }
    }

    for (const [id, btn] of game._controlsUI.pwrBtns.entries()) {
        const count = (game.powerUps && game.powerUps[id]) ? game.powerUps[id] : 0;
        const countEl = game._controlsUI.pwrCounts.get(id);
        if (countEl) countEl.textContent = String(count);

        if (count <= 0) btn.classList.add('disabled');
        else btn.classList.remove('disabled');
    }

    const mode = game.currentMode || '';
    const cls = game.playerClass || '';
    const boss = (game.currentLevelConfig && game.currentLevelConfig.type) ? game.currentLevelConfig.type : '';
    const heroSignature = `${mode}|${cls}|${boss}`;

    if (game._controlsUI.heroSignature !== heroSignature) {
        game._controlsUI.heroSignature = heroSignature;

        const rightGroup = game._controlsUI.rightGroup;
        rightGroup.innerHTML = '';
        game._controlsUI.heroBtns.clear();

        if (game.currentMode === 'adventure') {
            const heroes = [
                { id: 'thalion', icon: '\u{1F9DD}\u{200D}\u{2642}\u{FE0F}' },
                { id: 'nyx', icon: '\u{1F43A}' }
            ];

            if (game.playerClass === 'mage') heroes.push({ id: 'mage', icon: '\u{1F9D9}\u{200D}\u{2640}\u{FE0F}' });
            else heroes.push({ id: 'player', icon: '\u{2694}\u{FE0F}' });

            for (const h of heroes) {
                const btn = document.createElement('div');
                btn.className = 'ctrl-btn hero locked';
                btn.id = `btn-hero-${h.id}`;
                btn.textContent = h.icon;
                btn.addEventListener('click', () => game.activateHeroPower(h.id));

                rightGroup.appendChild(btn);
                game._controlsUI.heroBtns.set(h.id, btn);
            }
        }
    }

    game.updateControlsVisuals();
}

export function updateControlsVisuals(game) {
    const pwrIds = ['magnet', 'rotate', 'swap'];
    const pwrBtns = game._controlsUI?.pwrBtns;
    const pwrCounts = game._controlsUI?.pwrCounts;

    for (let i = 0; i < pwrIds.length; i++) {
        const id = pwrIds[i];
        const btn = pwrBtns ? pwrBtns.get(id) : document.getElementById(`btn-pwr-${id}`);
        if (!btn) continue;

        const count = (game.powerUps && game.powerUps[id]) ? game.powerUps[id] : 0;
        const countEl = pwrCounts ? pwrCounts.get(id) : btn.querySelector('.ctrl-count');
        if (countEl) {
            const newText = String(count);
            if (countEl.textContent !== newText) countEl.textContent = newText;
        }

        const shouldDisable = count <= 0;
        btn.classList.toggle('disabled', shouldDisable);
        btn.classList.toggle('active-mode', game.interactionMode === id);
    }

    if (game.currentMode !== 'adventure' || !game.heroState) return;

    const heroIds = ['thalion', 'nyx', 'player', 'mage'];
    const heroBtns = game._controlsUI?.heroBtns;

    for (let i = 0; i < heroIds.length; i++) {
        const id = heroIds[i];
        const btn = heroBtns ? heroBtns.get(id) : document.getElementById(`btn-hero-${id}`);
        if (!btn) continue;

        const state = game.heroState[id];
        if (!state) continue;

        if (!btn.classList.contains('ctrl-btn')) btn.classList.add('ctrl-btn');
        if (!btn.classList.contains('hero')) btn.classList.add('hero');

        const isUsed = !!state.used;
        const isReady = !isUsed && !!state.unlocked;
        const isLocked = !isUsed && !state.unlocked;

        btn.classList.toggle('used', isUsed);
        btn.classList.toggle('ready', isReady);
        btn.classList.toggle('locked', isLocked);
        btn.classList.toggle('active-mode', game.interactionMode === `hero_${id}`);
    }
}

export function handleBoardClick(game, r, c) {
    if (game.interactionMode) {
        game.powers.handleBoardInteraction(game.interactionMode, r, c);
        return;
    }
}

export function handlePieceClick(game, index) {
    if (game.interactionMode === 'rotate') {
        game.powers.useRotate(index);
    }
}

export function renderDock(game) {
    if (game._renderDockLocked) {
        game._renderDockPending = true;
        return;
    }

    game._renderDockLocked = true;
    if (!game._renderDockUnlockScheduled) {
        game._renderDockUnlockScheduled = true;
        requestAnimationFrame(() => {
            game._renderDockLocked = false;
            game._renderDockUnlockScheduled = false;
            if (game._renderDockPending) {
                game._renderDockPending = false;
                game.renderDock();
            }
        });
    }

    if (!game.dockEl) return;

    if (!game._dockSlots || game._dockSlots.length !== 3) {
        game.dockEl.innerHTML = '';
        game._dockSlots = [];
        game._dockSlotState = new Array(3);

        const frag = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.className = 'dock-slot';
            slot.dataset.slot = String(i);
            game.attachDockSlotDragEvents(slot);
            game._dockSlots.push(slot);
            frag.appendChild(slot);
        }
        game.dockEl.appendChild(frag);
        game.attachDockFallbackDragEvents();
    }

    for (let index = 0; index < 3; index++) {
        const slot = game._dockSlots[index];
        const piece = game.currentHand[index] || null;
        const layoutRef = piece ? (piece.layout || piece.matrix || null) : null;
        const prev = game._dockSlotState ? game._dockSlotState[index] : null;

        if (
            prev &&
            prev.pieceRef === piece &&
            prev.layoutRef === layoutRef &&
            slot.firstChild
        ) {
            continue;
        }

        if (slot.firstChild) slot.innerHTML = '';

        if (piece) {
            game.createDraggablePiece(piece, index, slot);
        }

        if (game._dockSlotState) {
            game._dockSlotState[index] = { pieceRef: piece, layoutRef };
        }
    }
}
