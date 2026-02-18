export function updateGhostPreview(game, clone, boardRect, cellSize, piece) {
    const perfStart = game.perfStart('ghost');
    const GAP = 4;
    const PADDING = 8;

    const px = game._lastPointerX;
    const py = game._lastPointerY;
    if (px == null || py == null) {
        game.perfEnd('ghost', perfStart);
        return;
    }

    const relativeX = px - (boardRect.left + PADDING);
    const relativeY = py - (boardRect.top + PADDING);

    const effectiveSize = cellSize + GAP;
    const invSize = 1 / effectiveSize;

    const exactCol = (relativeX * invSize) - (piece.matrix[0].length * 0.5);
    const exactRow = (relativeY * invSize) - (piece.matrix.length * 0.5);

    const baseR = Math.round(exactRow);
    const baseC = Math.round(exactCol);

    let bestR = 0;
    let bestC = 0;
    let bestValid = false;
    let minDist2 = Infinity;
    let found = false;

    for (let i = 0; i < 5; i++) {
        let r = baseR;
        let c = baseC;
        if (i === 1) r = baseR + 1;
        else if (i === 2) r = baseR - 1;
        else if (i === 3) c = baseC + 1;
        else if (i === 4) c = baseC - 1;

        const dr = r - exactRow;
        const dc = c - exactCol;
        const dist2 = (dr * dr) + (dc * dc);

        const valid = game.canPlace(r, c, piece);

        if (valid) {
            if (!found || !bestValid || dist2 < minDist2) {
                bestR = r;
                bestC = c;
                bestValid = true;
                minDist2 = dist2;
                found = true;
            }
        } else if (!found && dist2 < 0.36) {
            bestR = r;
            bestC = c;
            bestValid = false;
            found = true;
        }
    }

    if (!found) {
        if (game.activeSnap !== null) {
            game.activeSnap = null;
            game.clearGhostPreview();
            game.clearPredictionHighlights();
            game._lastGhostR = null;
            game._lastGhostC = null;
            game._lastGhostValid = null;
            game._lastPredR = null;
            game._lastPredC = null;
        }
        game.perfEnd('ghost', perfStart);
        return;
    }

    if (game._lastGhostR === bestR && game._lastGhostC === bestC && game._lastGhostValid === bestValid) {
        game.activeSnap = { r: bestR, c: bestC, valid: bestValid };
        return;
    }

    game._lastGhostR = bestR;
    game._lastGhostC = bestC;
    game._lastGhostValid = bestValid;
    game.activeSnap = { r: bestR, c: bestC, valid: bestValid };

    game.clearGhostPreview();
    game.clearPredictionHighlights();

    game.drawGhost(bestR, bestC, piece, bestValid);

    if (bestValid) {
        if (game._lastPredR !== bestR || game._lastPredC !== bestC) {
            game._lastPredR = bestR;
            game._lastPredC = bestC;

            const prediction = game.predictClears(bestR, bestC, piece);
            if (
                (prediction.rows && prediction.rows.length > 0) ||
                (prediction.cols && prediction.cols.length > 0)
            ) {
                game.drawPredictionHighlights(prediction);
            }
        }
    } else {
        game._lastPredR = null;
        game._lastPredC = null;
    }
    game.perfEnd('ghost', perfStart);
}

export function predictClears(game, r, c, piece) {
    const perfStart = game.perfStart('predictClears');
    const N = game.gridSize;
    const grid = game.grid;
    const layout = piece.layout;

    if (!game._predEmptyRows || game._predEmptyRows.length !== N) {
        game._predEmptyRows = new Int16Array(N);
        game._predEmptyCols = new Int16Array(N);
    }

    const emptyRows = game._predEmptyRows;
    const emptyCols = game._predEmptyCols;

    for (let i = 0; i < N; i++) {
        emptyRows[i] = 0;
        emptyCols[i] = 0;
    }

    for (let row = 0; row < N; row++) {
        const gRow = grid[row];
        for (let col = 0; col < N; col++) {
            if (gRow[col] === null) {
                emptyRows[row]++;
                emptyCols[col]++;
            }
        }
    }

    if (!game._predMark || game._predMark.length !== N * N) {
        game._predMark = new Uint8Array(N * N);
    }
    const mark = game._predMark;

    for (let i = 0; i < mark.length; i++) mark[i] = 0;

    for (let i = 0, rows = layout.length; i < rows; i++) {
        const lRow = layout[i];
        for (let j = 0, cols = lRow.length; j < cols; j++) {
            if (!lRow[j]) continue;

            const tr = r + i;
            const tc = c + j;
            if (tr < 0 || tr >= N || tc < 0 || tc >= N) continue;
            if (grid[tr][tc] !== null) continue;

            const idx = tr * N + tc;
            if (mark[idx]) continue;
            mark[idx] = 1;

            emptyRows[tr]--;
            emptyCols[tc]--;
        }
    }

    const rowsToClear = [];
    const colsToClear = [];

    for (let row = 0; row < N; row++) {
        if (emptyRows[row] === 0) rowsToClear.push(row);
    }
    for (let col = 0; col < N; col++) {
        if (emptyCols[col] === 0) colsToClear.push(col);
    }

    game.perfEnd('predictClears', perfStart);
    return { rows: rowsToClear, cols: colsToClear };
}

export function drawPredictionHighlights(game, { rows, cols }) {
    if (!game._predLinesH || !game._predLinesV) {
        game._predLinesH = new Array(8);
        game._predLinesV = new Array(8);

        for (let i = 0; i < 8; i++) {
            const h = document.createElement('div');
            h.className = 'prediction-line';
            h.style.gridColumnStart = 1;
            h.style.gridColumnEnd = -1;
            h.style.gridRowEnd = 'span 1';
            h.style.display = 'none';
            game.boardEl.appendChild(h);
            game._predLinesH[i] = h;

            const v = document.createElement('div');
            v.className = 'prediction-line';
            v.style.gridRowStart = 1;
            v.style.gridRowEnd = -1;
            v.style.gridColumnEnd = 'span 1';
            v.style.display = 'none';
            game.boardEl.appendChild(v);
            game._predLinesV[i] = v;
        }
    }

    const rList = Array.isArray(rows) ? rows : [];
    const cList = Array.isArray(cols) ? cols : [];

    for (let i = 0; i < 8; i++) {
        const h = game._predLinesH[i];
        if (h.style.display !== 'none') h.style.display = 'none';

        const v = game._predLinesV[i];
        if (v.style.display !== 'none') v.style.display = 'none';
    }

    const rh = rList.length < 8 ? rList.length : 8;
    for (let i = 0; i < rh; i++) {
        const rowIndex = rList[i];
        if (rowIndex < 0 || rowIndex > 7) continue;

        const line = game._predLinesH[i];
        line.style.gridRowStart = (rowIndex + 1);
        line.style.display = 'block';
    }

    const cv = cList.length < 8 ? cList.length : 8;
    for (let i = 0; i < cv; i++) {
        const colIndex = cList[i];
        if (colIndex < 0 || colIndex > 7) continue;

        const line = game._predLinesV[i];
        line.style.gridColumnStart = (colIndex + 1);
        line.style.display = 'block';
    }
}

export function clearPredictionHighlights(game) {
    if (!game._predLinesH || !game._predLinesV) {
        const lines = game.boardEl.querySelectorAll('.prediction-line');
        lines.forEach((el) => el.remove());
        return;
    }

    for (let i = 0; i < 8; i++) {
        const h = game._predLinesH[i];
        if (h && h.style.display !== 'none') h.style.display = 'none';

        const v = game._predLinesV[i];
        if (v && v.style.display !== 'none') v.style.display = 'none';
    }
}

export function drawGhost(game, r, c, piece, isValid) {
    const className = isValid ? 'ghost-valid' : 'ghost-invalid';

    if (!game._ghostIdxs) game._ghostIdxs = [];
    const ghostIdxs = game._ghostIdxs;

    const layout = piece.layout;
    const gridSize = game.gridSize;
    const boardChildren = game._boardCells || game.boardEl.children;

    const useClassicColor =
        game.currentMode === 'classic' &&
        game.classicState.visualV1 &&
        piece.colorId;

    const colorClass = useClassicColor
        ? `classic-color-${piece.colorId}`
        : null;

    for (let i = 0, rows = layout.length; i < rows; i++) {
        const row = layout[i];
        for (let j = 0, cols = row.length; j < cols; j++) {
            if (!row[j]) continue;

            const targetR = r + i;
            const targetC = c + j;
            if (
                targetR < 0 ||
                targetR >= gridSize ||
                targetC < 0 ||
                targetC >= gridSize
            ) {
                continue;
            }

            const idx = (targetR << 3) + targetC;
            const cell = boardChildren[idx];
            if (!cell) continue;

            cell.classList.add('ghost', className);

            if (colorClass) {
                cell.classList.add(colorClass);
            }

            ghostIdxs.push(idx);
        }
    }
}

export function clearGhostPreview(game) {
    const idxs = game._ghostIdxs;
    if (!idxs || idxs.length === 0) return;

    const boardChildren = game._boardCells || game.boardEl.children;
    const grid = game.grid;
    const gridSize = game.gridSize;

    const isClassicVisual =
        game.currentMode === 'classic' &&
        game.classicState.visualV1;

    for (let k = 0; k < idxs.length; k++) {
        const idx = idxs[k];
        const cell = boardChildren[idx];
        if (!cell) continue;

        cell.classList.remove('ghost', 'ghost-valid', 'ghost-invalid');

        const r = (idx / gridSize) | 0;
        const c = idx - (r * gridSize);

        if (grid[r]?.[c] !== null) continue;

        if (isClassicVisual) {
            const classList = cell.classList;
            for (let i = 0; i < classList.length; i++) {
                const cls = classList[i];
                if (cls.startsWith('classic-color-')) {
                    classList.remove(cls);
                    break;
                }
            }
        }
    }

    idxs.length = 0;
}
