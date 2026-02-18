export function getMovesAvailabilityCacheKey(game) {
    let hash = 2166136261;
    const grid = game.grid;
    const N = game.gridSize;

    for (let r = 0; r < N; r++) {
        const row = grid[r];
        for (let c = 0; c < N; c++) {
            const cell = row[c];
            if (cell === null) {
                hash ^= 31;
                hash = Math.imul(hash, 16777619);
                continue;
            }
            hash ^= 131;
            hash = Math.imul(hash, 16777619);
            const key = cell.key || cell.type || '';
            for (let i = 0; i < key.length; i++) {
                hash ^= key.charCodeAt(i);
                hash = Math.imul(hash, 16777619);
            }
        }
    }

    const hand = game.currentHand || [];
    for (let i = 0; i < hand.length; i++) {
        const piece = hand[i];
        if (!piece) {
            hash ^= 7;
            hash = Math.imul(hash, 16777619);
            continue;
        }
        const name = piece.name || '';
        for (let k = 0; k < name.length; k++) {
            hash ^= name.charCodeAt(k);
            hash = Math.imul(hash, 16777619);
        }
        const layout = piece.layout || piece.matrix || [];
        hash ^= layout.length || 0;
        hash = Math.imul(hash, 16777619);
        hash ^= layout[0]?.length || 0;
        hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(36);
}

export function checkMovesAvailable(game) {
    if (!game.dockEl) return true;

    const hand = game.currentHand;
    if (!hand || hand.length === 0) return true;

    const cacheKey = game.getMovesAvailabilityCacheKey();
    if (game._movesAvailabilityCache?.key === cacheKey) {
        return game._movesAvailabilityCache.result;
    }

    const pieces = [];
    for (let i = 0; i < hand.length; i++) {
        const p = hand[i];
        if (p) pieces.push(p);
    }
    if (pieces.length === 0) return true;

    const N = game.gridSize;
    const grid = game.grid;

    if (!game._emptyCellsIdx || game._emptyCellsDirty) {
        const emptiesIdx = [];
        for (let r = 0; r < N; r++) {
            const row = grid[r];
            for (let c = 0; c < N; c++) {
                if (row[c] === null) emptiesIdx.push(r * N + c);
            }
        }
        game._emptyCellsIdx = emptiesIdx;
        game._emptyCellsDirty = false;
        if (emptiesIdx.length === 0) return false;
    }

    const emptiesIdx = game._emptyCellsIdx;
    const visitedSize = N * N;
    if (!game._movesVisited || game._movesVisited.length !== visitedSize) {
        game._movesVisited = new Int32Array(visitedSize);
        game._movesVisitedStamp = 1;
    }
    const visited = game._movesVisited;

    for (let pi = 0; pi < pieces.length; pi++) {
        const piece = pieces[pi];

        const layout = piece.layout || piece.matrix;
        const rows = layout?.length || 0;
        const cols = layout?.[0]?.length || 0;
        if (!rows || !cols) continue;

        let movesCache = piece._movesFilledFlatCache;
        if (!movesCache || movesCache._layoutRef !== layout) {
            const filledFlatBuilt = [];
            for (let dr = 0; dr < rows; dr++) {
                const row = layout[dr];
                for (let dc = 0; dc < cols; dc++) {
                    if (row[dc]) filledFlatBuilt.push(dr, dc);
                }
            }
            movesCache = {
                _layoutRef: layout,
                filledFlat: filledFlatBuilt
            };
            piece._movesFilledFlatCache = movesCache;
        }
        const filledFlat = movesCache.filledFlat;
        if (filledFlat.length === 0) continue;

        let stamp = (game._movesVisitedStamp | 0) + 1;
        if (stamp === 0x7fffffff) {
            visited.fill(0);
            stamp = 1;
        }
        game._movesVisitedStamp = stamp;

        for (let e = 0; e < emptiesIdx.length; e++) {
            const empty = emptiesIdx[e];
            const er = (empty / N) | 0;
            const ec = empty - (er * N);

            for (let k = 0; k < filledFlat.length; k += 2) {
                const dr = filledFlat[k];
                const dc = filledFlat[k + 1];

                const baseR = er - dr;
                const baseC = ec - dc;

                if (baseR < 0 || baseC < 0) continue;
                if (baseR + rows > N) continue;
                if (baseC + cols > N) continue;

                const key = baseR * N + baseC;
                if (visited[key] === stamp) continue;
                visited[key] = stamp;

                if (game.canPlace(baseR, baseC, piece)) {
                    game._movesAvailabilityCache = { key: cacheKey, result: true };
                    return true;
                }
            }
        }
    }

    game._movesAvailabilityCache = { key: cacheKey, result: false };
    return false;
}
