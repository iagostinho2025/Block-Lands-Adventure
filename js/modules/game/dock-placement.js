export function attachDockFallbackDragEvents(game) {
    if (!game.dockEl || game.dockEl._dockFallbackDragAttached) return;
    game.dockEl._dockFallbackDragAttached = true;

    const hasPointer = typeof window.PointerEvent !== 'undefined';
    const getPoint = (evt) => {
        const t = evt.touches ? evt.touches[0] : evt;
        return { x: t.clientX, y: t.clientY };
    };

    const onDockStart = (e) => {
        if (!game._dockSlots || game._dockSlots.length === 0) return;
        const target = e.target;
        let chosenSlot = null;
        if (target && typeof target.closest === 'function') {
            chosenSlot = target.closest('.dock-slot');
        }

        if (!chosenSlot) {
            const p = getPoint(e);
            const hitMargin = 12;

            for (let i = 0; i < game._dockSlots.length; i++) {
                const slot = game._dockSlots[i];
                const r = slot.getBoundingClientRect();
                if (
                    p.x >= (r.left - hitMargin) &&
                    p.x <= (r.right + hitMargin) &&
                    p.y >= (r.top - hitMargin) &&
                    p.y <= (r.bottom + hitMargin)
                ) {
                    chosenSlot = slot;
                    break;
                }
            }
        }
        if (!chosenSlot) return;

        const pieceEl = chosenSlot.querySelector('.draggable-piece');
        if (!pieceEl || typeof pieceEl._dragStartFromExternal !== 'function') return;
        pieceEl._dragStartFromExternal(e);
    };

    if (hasPointer) {
        game.dockEl.addEventListener('pointerdown', onDockStart, { passive: false });
    } else {
        game.dockEl.addEventListener('mousedown', onDockStart, { passive: false });
        game.dockEl.addEventListener('touchstart', onDockStart, { passive: false });
    }

    if (game._globalDockFallbackAttached) return;
    game._globalDockFallbackAttached = true;

    const onGlobalStart = (e) => {
        if (!game.dockEl || !game._dockSlots || game._dockSlots.length === 0) return;
        if (game.currentMode !== 'adventure') return;
        if (!game.currentLevelConfig || game.currentLevelConfig.type !== 'boss') return;
        if (!game.screenGame || !game.screenGame.classList.contains('active-screen')) return;

        const p = getPoint(e);
        const dockRect = game.dockEl.getBoundingClientRect();
        const margin = 10;

        const insideDock =
            p.x >= (dockRect.left - margin) &&
            p.x <= (dockRect.right + margin) &&
            p.y >= (dockRect.top - margin) &&
            p.y <= (dockRect.bottom + margin);

        if (!insideDock) return;

        let chosenSlot = null;
        for (let i = 0; i < game._dockSlots.length; i++) {
            const slot = game._dockSlots[i];
            const r = slot.getBoundingClientRect();
            if (
                p.x >= (r.left - margin) &&
                p.x <= (r.right + margin) &&
                p.y >= (r.top - margin) &&
                p.y <= (r.bottom + margin)
            ) {
                chosenSlot = slot;
                break;
            }
        }
        if (!chosenSlot) return;

        const pieceEl = chosenSlot.querySelector('.draggable-piece');
        if (!pieceEl || typeof pieceEl._dragStartFromExternal !== 'function') return;
        pieceEl._dragStartFromExternal(e);
    };

    if (hasPointer) {
        window.addEventListener('pointerdown', onGlobalStart, { passive: false, capture: true });
    } else {
        window.addEventListener('mousedown', onGlobalStart, { passive: false, capture: true });
        window.addEventListener('touchstart', onGlobalStart, { passive: false, capture: true });
    }
}

export function attachDockSlotDragEvents(slot) {
    if (!slot || slot._dragZoneAttached) return;
    slot._dragZoneAttached = true;

    const hasPointer = typeof window.PointerEvent !== 'undefined';
    const onSlotStart = (e) => {
        const pieceEl = slot.querySelector('.draggable-piece');
        if (!pieceEl || typeof pieceEl._dragStartFromExternal !== 'function') return;
        pieceEl._dragStartFromExternal(e);
    };

    if (hasPointer) {
        slot.addEventListener('pointerdown', onSlotStart, { passive: false });
    } else {
        slot.addEventListener('mousedown', onSlotStart, { passive: false });
        slot.addEventListener('touchstart', onSlotStart, { passive: false });
    }
}

export function canPlacePieceAnywhere(game, piece) {
    if (!piece || !piece.layout) return false;

    const rows = piece.layout.length;
    const cols = piece.layout[0]?.length || 0;
    if (!rows || !cols) return false;

    const maxR = game.gridSize - rows;
    const maxC = game.gridSize - cols;
    if (maxR < 0 || maxC < 0) return false;

    for (let r = 0; r <= maxR; r++) {
        for (let c = 0; c <= maxC; c++) {
            if (game.canPlace(r, c, piece)) return true;
        }
    }

    return false;
}

export function canPlaceSquare3x3Anywhere(game) {
    if (!game._classicSquare3x3TestPiece) {
        const layout3x3 = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];

        game._classicSquare3x3TestPiece = {
            name: 'square-3x3',
            layout: layout3x3,
            matrix: layout3x3
        };
    }

    return game.canPlacePieceAnywhere(game._classicSquare3x3TestPiece);
}
