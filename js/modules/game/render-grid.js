export function renderGrid(game) {
    const perfStart = game.perfStart('renderGrid');
    if (game._renderGridLocked) {
        game._renderGridPending = true;
        game.perfEnd('renderGrid', perfStart);
        return;
    }

    game._renderGridLocked = true;
    if (!game._renderGridUnlockScheduled) {
        game._renderGridUnlockScheduled = true;
        requestAnimationFrame(() => {
            game._renderGridLocked = false;
            game._renderGridUnlockScheduled = false;
            if (game._renderGridPending) {
                game._renderGridPending = false;
                game.renderGrid();
            }
        });
    }

    game.ensureBoardCells();

    const size = game.gridSize;
    const cells = game._boardCells;
    const grid = game.grid;

    for (let r = 0; r < size; r++) {
        const row = grid[r];
        const base = r * size;
        for (let c = 0; c < size; c++) {
            game.renderCell(cells[base + c], row[c]);
        }
    }

    game._emptyCellsDirty = true;
    game.perfEnd('renderGrid', perfStart);
}
