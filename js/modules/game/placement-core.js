export function canPlace(game, r, c, piece) {
    let cache = piece._placeCache;
    const layout = piece.layout;
    if (
        !cache ||
        !cache.filled ||
        !Array.isArray(cache.filled) ||
        cache.rows == null ||
        cache.cols == null ||
        cache._layoutRef !== layout
    ) {
        const filled = [];
        const rows = layout.length;
        const cols = layout[0]?.length || 0;

        for (let i = 0; i < rows; i++) {
            const row = layout[i];
            for (let j = 0; j < cols; j++) {
                if (row[j]) filled.push([i, j]);
            }
        }

        cache = piece._placeCache = {
            rows,
            cols,
            filled,
            _layoutRef: layout
        };
    }

    const gridSize = game.gridSize;

    if (r < 0 || c < 0) return false;
    if (r + cache.rows > gridSize) return false;
    if (c + cache.cols > gridSize) return false;

    const g = game.grid;
    const filled = cache.filled;

    for (let k = 0; k < filled.length; k++) {
        const pos = filled[k];
        if (g[r + pos[0]][c + pos[1]] !== null) return false;
    }

    return true;
}

export function placePiece(game, r, c, piece) {
    if (!game.canPlace(r, c, piece)) return false;

    const layout = piece.layout;
    const grid = game.grid;
    const size = game.gridSize;

    const isClassicV1 =
        game.currentMode === 'classic' &&
        game.classicState.visualV1 &&
        piece.colorId;

    const pieceColorId = isClassicV1 ? piece.colorId : 0;

    let popCells = null;
    if (isClassicV1) {
        popCells = game._classicPopCells || (game._classicPopCells = []);
    }

    for (let i = 0, rows = layout.length; i < rows; i++) {
        const row = layout[i];
        for (let j = 0, cols = row.length; j < cols; j++) {
            const cellData = row[j];
            if (!cellData) continue;

            const targetR = r + i;
            const targetC = c + j;

            if (targetR < 0 || targetR >= size || targetC < 0 || targetC >= size) continue;

            if (pieceColorId) {
                cellData.colorId = pieceColorId;
            }

            grid[targetR][targetC] = cellData;

            const idx = (targetR * size) + targetC;
            const cellEl = game._boardCells
                ? game._boardCells[idx]
                : game.boardEl.children[idx];

            if (cellEl) {
                cellEl._rk = null;
                game.renderCell(cellEl, cellData);

                if (pieceColorId) {
                    cellEl.classList.add('classic-pop');
                    popCells.push(cellEl);
                }
            }
        }
    }

    if (popCells && popCells.length) {
        if (game._classicPopTimer) clearTimeout(game._classicPopTimer);
        game._classicPopTimer = setTimeout(() => {
            for (let i = 0; i < popCells.length; i++) {
                popCells[i].classList.remove('classic-pop');
            }
            popCells.length = 0;
            game._classicPopTimer = 0;
        }, 300);
    }

    game._emptyCellsDirty = true;
    return true;
}
