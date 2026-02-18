export function queueLayoutGeometryLog(game, tag, deps = {}) {
    if (!deps.debugLayoutGeometry) return;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            game.logLayoutGeometry(tag);
        });
    });
}

export function logLayoutGeometry(game, tag, deps = {}) {
    if (!deps.debugLayoutGeometry) return;

    const board = document.querySelector('#game-board');
    const dock = document.querySelector('#dock');
    const tray = document.querySelector('#powerups-area');
    const goals = document.querySelector('#goals-area');

    const round = (value) => Math.round(value);
    const rect = (el) => {
        if (!el) return null;
        const box = el.getBoundingClientRect();
        return {
            x: round(box.x),
            y: round(box.y),
            w: round(box.width),
            h: round(box.height)
        };
    };

    console.log('[layout-geom]', tag, {
        levelId: game.currentLevelConfig?.id ?? null,
        levelType: game.currentLevelConfig?.type ?? null,
        board: rect(board),
        dock: rect(dock),
        tray: rect(tray),
        goals: rect(goals)
    });
}

export function queueDockGeometryLog(game, tag, deps = {}) {
    if (!deps.debugDockGeometry) return;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            game.logDockGeometry(tag);
        });
    });
}

export function logDockGeometry(game, tag, deps = {}) {
    if (!deps.debugDockGeometry) return;

    const dock = document.querySelector('#powerups-area');
    const slot = dock ? dock.querySelector('.btn-powerup') : null;
    if (!dock || !slot) return;

    const round = (value) => Math.round(value);
    const rect = (el) => {
        const box = el.getBoundingClientRect();
        return {
            x: round(box.x),
            y: round(box.y),
            w: round(box.width),
            h: round(box.height)
        };
    };

    console.log('[dock-geom]', tag, {
        levelId: game.currentLevelConfig?.id ?? null,
        levelType: game.currentLevelConfig?.type ?? null,
        dock: rect(dock),
        button: rect(slot)
    });
}
