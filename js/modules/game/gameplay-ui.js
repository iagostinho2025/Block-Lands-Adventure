export function setupGoalsUI(game, goalsConfig, deps = {}) {
    if (!game.goalsArea) return;
    const debugBossHud = Boolean(deps.debugBossHud);
    const emojiMap = deps.emojiMap || {};
    const isBossFight = game.currentMode === 'adventure' && game.currentLevelConfig?.type === 'boss';
    if (isBossFight) {
        if (debugBossHud) {
            console.log('[HUD] Skipping normal goals UI for boss/elite fight:', game.currentLevelConfig?.id);
        }
        return;
    }
    game.currentGoals = { ...goalsConfig };
    game.collected = {};
    Object.keys(game.currentGoals).forEach((key) => {
        game.collected[key] = 0;
    });

    let html = '<div class="goals-container">';
    Object.keys(game.currentGoals).forEach((key) => {
        const emoji = emojiMap[key] || '\u2753';
        const spritePath = game.getItemSpritePathByKey(key);
        const goalVisual = spritePath
            ? `<span class="goal-emoji goal-sprite" style="background-image: url('${spritePath}');" aria-hidden="true"></span>`
            : `<span class="goal-emoji">${emoji}</span>`;
        html += `
            <div class="goal-item" id="goal-item-${key}">
                <div class="goal-circle type-${key}-glow">${goalVisual}</div>
                <div class="goal-info"><span class="goal-counter" id="goal-val-${key}">0/${game.currentGoals[key]}</span></div>
            </div>`;
    });
    html += '</div>';
    game.goalsArea.innerHTML = html;
    if (debugBossHud) {
        console.log('[HUD] Normal goals UI rendered. Fight type:', game.currentLevelConfig?.type || 'none');
    }
}

export function ensureBoardFrameOnBoard() {
    const board = document.querySelector('#game-board');
    if (!board) return;

    // Frame asset removed; keep function as no-op to avoid 404s.
    return;

    const existingFrames = board.querySelectorAll(':scope > .board-frame');
    existingFrames.forEach((frame) => frame.remove());

    const frameEl = document.createElement('img');
    frameEl.className = 'board-frame';
    frameEl.alt = '';
    frameEl.setAttribute('aria-hidden', 'true');
    frameEl.src = './assets/img/frame-board-fire-elite.webp';

    board.insertBefore(frameEl, board.firstChild);
}

export function removeBoardFrameFromBoard() {
    const board = document.querySelector('#game-board');
    if (!board) return;

    const existingFrames = board.querySelectorAll(':scope > .board-frame');
    existingFrames.forEach((frame) => frame.remove());
}
