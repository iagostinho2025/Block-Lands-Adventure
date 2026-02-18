export function createDraggablePiece(game, piece, index, parentContainer) {
    let container = parentContainer.querySelector('.draggable-piece');

    const rows = piece.matrix.length;
    const cols = piece.matrix[0].length;

    if (!container) {
        container = document.createElement('div');
        container.className = 'draggable-piece';
        parentContainer.appendChild(container);

        container.addEventListener('click', () => {
            game.handlePieceClick(Number(container.dataset.index));
        });

        game.attachDragEvents(container, piece);
    }

    container.dataset.index = index;
    container._pieceRef = piece;

    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const needed = rows * cols;
    if (container.children.length !== needed) {
        container.innerHTML = '';
        const frag = document.createDocumentFragment();
        for (let i = 0; i < needed; i++) {
            frag.appendChild(document.createElement('div'));
        }
        container.appendChild(frag);
    }

    let k = 0;
    for (let i = 0; i < piece.layout.length; i++) {
        const row = piece.layout[i];
        for (let j = 0; j < row.length; j++) {
            const cellData = row[j];
            const block = container.children[k++];

            block.className = '';
            block.innerText = '';
            block.style.visibility = '';

            if (cellData) {
                block.classList.add('block-unit');
                game.applyColorClass(block, cellData);

                if (game.currentMode === 'classic' && game.classicState.visualV1 && piece.colorId) {
                    block.classList.add(`classic-color-${piece.colorId}`);
                    block.classList.add('classic-piece-glow');
                }

                if (typeof cellData === 'object' && cellData.type === 'ITEM') {
                    const emoji = game.getItemGlyph(cellData);
                    block.innerText = emoji;
                }
            } else {
                block.style.visibility = 'hidden';
            }
        }
    }

    while (k < container.children.length) {
        const block = container.children[k++];
        block.className = '';
        block.innerText = '';
        block.style.visibility = 'hidden';
    }
}

export function getBoardMetrics(game, padding = 0) {
    if (!game.boardEl) return { rect: null, cellSize: 0 };

    if (!game._boardMetrics || game._boardMetricsDirty) {
        const rect = game.boardEl.getBoundingClientRect();
        let cellSize = 0;

        const firstCell = game.boardEl.querySelector('.cell');
        if (firstCell) {
            const cellRect = firstCell.getBoundingClientRect();
            cellSize = cellRect.width || ((rect.width - (padding * 2)) / game.gridSize);
        } else {
            cellSize = (rect.width - (padding * 2)) / game.gridSize;
        }

        game._boardMetrics = { rect, cellSize };
        game._boardMetricsDirty = false;
    }

    return game._boardMetrics;
}

export function attachDragEvents(game, el, piece, deps = {}) {
    const dragVisualOffsetY = deps.dragVisualOffsetY ?? 0;
    const bossLogic = deps.bossLogic || {};
    if (el._dragAttached) return;
    el._dragAttached = true;

    let isDragging = false;
    let clone = null;
    let activePointerId = null;

    let cellPixelSize = 0;
    let boardRect = null;

    let halfW = 0;
    let halfH = 0;
    let activePiece = null;

    let rafId = 0;
    let lastClientX = 0;
    let lastClientY = 0;
    let hasMovedSinceStart = false;

    const GAP = 4;
    const PADDING = 8;
    const VISUAL_OFFSET_Y = dragVisualOffsetY;
    const MOVE_EPS = 0.5;
    const HAS_POINTER = typeof window.PointerEvent !== 'undefined';

    const getPoint = (evt) => {
        const t = evt.touches ? evt.touches[0] : evt;
        return { x: t.clientX, y: t.clientY };
    };
    const getChangedPoint = (evt) => {
        const t = evt.changedTouches ? evt.changedTouches[0] : evt;
        return { x: t.clientX, y: t.clientY };
    };

    const cleanupGlobalListeners = () => {
        if (HAS_POINTER) {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onEnd);
            window.removeEventListener('pointercancel', onEnd);
        } else {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchend', onEnd);
            window.removeEventListener('touchcancel', onEnd);
        }
        window.removeEventListener('blur', onEnd);
    };

    const ensureGlobalListeners = () => {
        if (HAS_POINTER) {
            window.addEventListener('pointermove', onMove, { passive: false });
            window.addEventListener('pointerup', onEnd, { passive: true });
            window.addEventListener('pointercancel', onEnd, { passive: true });
        } else {
            window.addEventListener('mousemove', onMove, { passive: false });
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('mouseup', onEnd, { passive: true });
            window.addEventListener('touchend', onEnd, { passive: true });
            window.addEventListener('touchcancel', onEnd, { passive: true });
        }
        window.addEventListener('blur', onEnd, { passive: true });
    };

    const moveCloneToPointer = () => {
        const x = (lastClientX - halfW);
        const y = (lastClientY - halfH - VISUAL_OFFSET_Y);
        clone.style.translate = `${x}px ${y}px`;
    };

    const scheduleMove = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            rafId = 0;
            if (!isDragging || !clone) return;

            moveCloneToPointer();

            game._lastPointerX = lastClientX;
            game._lastPointerY = lastClientY - VISUAL_OFFSET_Y;

            game.updateGhostPreview(clone, boardRect, cellPixelSize, activePiece);
        });
    };

    const onStart = (e) => {
        if (HAS_POINTER && e.type !== 'pointerdown') return;
        if (game.interactionMode === 'rotate') return;
        if (isDragging) return;
        if (e.cancelable) e.preventDefault();

        activePiece = el._pieceRef || piece;
        if (!activePiece || !activePiece.matrix || !Array.isArray(activePiece.matrix)) return;
        hasMovedSinceStart = false;

        if (game.audio) game.audio.playDrag();

        isDragging = true;
        game.activeSnap = null;
        activePointerId = (e.pointerId != null) ? e.pointerId : null;

        ensureGlobalListeners();

        const metrics = game.getBoardMetrics(PADDING);
        boardRect = metrics.rect;
        cellPixelSize = metrics.cellSize;

        if (!boardRect || !cellPixelSize) {
            isDragging = false;
            cleanupGlobalListeners();
            return;
        }

        clone = el.cloneNode(true);
        clone.classList.add('dragging-active');
        clone.style.display = 'grid';

        const cols = activePiece.matrix[0].length;
        const rows = activePiece.matrix.length;

        clone.style.width = (cols * cellPixelSize) + 'px';
        clone.style.height = (rows * cellPixelSize) + 'px';
        clone.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        clone.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        clone.style.gap = `${GAP}px`;
        clone.style.position = 'fixed';
        clone.style.left = '0px';
        clone.style.top = '0px';
        clone.style.margin = '0';
        clone.style.willChange = 'translate, transform, opacity';
        clone.style.translate = '-9999px -9999px';

        document.body.appendChild(clone);

        halfW = (cols * cellPixelSize) * 0.5;
        halfH = (rows * cellPixelSize) * 0.5;

        const p = getPoint(e);
        lastClientX = p.x;
        lastClientY = p.y;

        game._lastPointerX = lastClientX;
        game._lastPointerY = lastClientY - VISUAL_OFFSET_Y;

        moveCloneToPointer();
        game.updateGhostPreview(clone, boardRect, cellPixelSize, activePiece);

        el.style.opacity = '0';
    };

    const onMove = (e) => {
        if (!isDragging || !clone) return;
        if (HAS_POINTER && activePointerId != null && e.pointerId !== activePointerId) return;
        if (e.cancelable) e.preventDefault();

        const p = getPoint(e);
        const dx = Math.abs(p.x - lastClientX);
        const dy = Math.abs(p.y - lastClientY);
        if (dx < MOVE_EPS && dy < MOVE_EPS) return;

        hasMovedSinceStart = true;
        lastClientX = p.x;
        lastClientY = p.y;

        scheduleMove();
    };

    const onEnd = (e) => {
        if (!isDragging) return;
        if (HAS_POINTER && activePointerId != null && e.pointerId !== activePointerId) return;

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
        }

        cleanupGlobalListeners();
        activePointerId = null;

        game.clearPredictionHighlights();
        isDragging = false;

        const p = getChangedPoint(e);
        const dropX = p.x;
        const dropY = p.y;

        if (!hasMovedSinceStart) {
            el.style.opacity = '1';
            if (clone) {
                clone.remove();
                clone = null;
            }
            game.clearGhostPreview();
            game.activeSnap = null;
            game._lastGhostR = null;
            game._lastGhostC = null;
            game._lastGhostValid = null;
            game._lastPredR = null;
            game._lastPredC = null;
            return;
        }

        let placed = false;
        if (game.activeSnap && game.activeSnap.valid) {
            placed = game.placePiece(game.activeSnap.r, game.activeSnap.c, activePiece);
        }

        if (placed) {
            if (game.audio) {
                game.audio.playDrop();
                game.audio.vibrate(20);
            }

            el.remove();

            const index = parseInt(el.dataset.index, 10);
            if (!isNaN(index)) game.currentHand[index] = null;

            let hasWon = false;

            try {
                const damageDealt = game.checkLines(dropX, dropY);
                const linesCleared = game._lastLinesCleared || 0;

                if (game.currentMode === 'blitz' && game.blitz) {
                    game.blitz.onLinesCleared(linesCleared);
                }

                if (game.currentMode === 'classic') {
                    game.updateMissionProgress('placement', {});
                }

                if (game.currentMode === 'adventure') {
                    if (game.bossState.active) {
                        game.processBossTurn(damageDealt);
                        if (game.bossState.currentHp <= 0) hasWon = true;
                    } else {
                        hasWon = game.checkVictoryConditions();
                    }
                } else {
                    hasWon = game.checkVictoryConditions();
                }
            } catch (err) {
                console.error(err);
            }

            if (game.bossState.active && !hasWon) {
                if (game.hasPendingBossResolution()) {
                    game._postImpactBossTurnEndNeeded = true;
                } else {
                    const bossId = game.currentLevelConfig.boss?.id;
                    if (bossLogic && bossLogic[bossId] && bossLogic[bossId].onTurnEnd) {
                        bossLogic[bossId].onTurnEnd(game);
                    }
                }
            }

            if (!hasWon) {
                const remainingPieces = game.dockEl.querySelectorAll('.draggable-piece');
                if (remainingPieces.length === 0) {
                    game.spawnNewHand();
                } else {
                    game.saveGameState();
                    const shouldDeferMoveCheck =
                        game.currentMode === 'adventure' &&
                        game.bossState.active &&
                        game.hasPendingBossResolution();

                    if (shouldDeferMoveCheck) {
                        game._postImpactMoveCheckNeeded = true;
                    } else if (!game.checkMovesAvailable()) {
                        game.gameOver();
                    }
                }
            }
        } else {
            el.style.opacity = '1';
        }

        if (clone) {
            clone.remove();
            clone = null;
        }

        game.clearGhostPreview();
        game.activeSnap = null;
        game._lastGhostR = null;
        game._lastGhostC = null;
        game._lastGhostValid = null;
        game._lastPredR = null;
        game._lastPredC = null;
    };

    el._dragStartFromExternal = onStart;
    el._dragCleanup = cleanupGlobalListeners;
}

export function moveClone(_game, clone, clientX, clientY, deps = {}) {
    const visualOffsetY = deps.dragVisualOffsetY ?? 0;
    const x = clientX - (clone.offsetWidth / 2);
    const y = clientY - (clone.offsetHeight / 2) - visualOffsetY;
    clone.style.left = x + 'px';
    clone.style.top = y + 'px';
}
