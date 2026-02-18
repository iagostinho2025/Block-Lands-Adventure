export function ensureBoardClickDelegation(game) {
    if (game._boardClickDelegationInstalled) return;
    game._boardClickDelegationInstalled = true;

    game.boardEl.addEventListener('click', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell || !game.boardEl.contains(cell)) return;

        const r = Number(cell.dataset.r);
        const c = Number(cell.dataset.c);
        if (Number.isNaN(r) || Number.isNaN(c)) return;

        game.handleBoardClick(r, c);
    });
}

export function ensureBoardCells(game) {
    if (game._boardCells && game._boardCells.length === game.gridSize * game.gridSize) return;

    game.ensureBoardClickDelegation();

    game.boardEl.innerHTML = '';
    game._boardCells = new Array(game.gridSize * game.gridSize);

    const frag = document.createDocumentFragment();
    for (let r = 0; r < game.gridSize; r++) {
        for (let c = 0; c < game.gridSize; c++) {
            const div = document.createElement('div');
            div.className = 'cell';
            div.dataset.r = r;
            div.dataset.c = c;
            game._boardCells[r * game.gridSize + c] = div;
            frag.appendChild(div);
        }
    }
    game.boardEl.appendChild(frag);
}

export function renderCell(game, div, cellData) {
    const prevKey = div._rk;

    if (!cellData) {
        if (prevKey === 'E' && div.className === 'cell' && div.textContent === '') return;
        div.className = 'cell';
        if (div.textContent) div.textContent = '';
        div._rk = 'E';
        return;
    }

    if (cellData.type === 'LAVA') {
        const key = 'L';
        if (prevKey !== key || div.className !== 'cell lava' || div.textContent !== '\u{1F30B}') {
            div.className = 'cell lava';
            div.textContent = '\u{1F30B}';
            div._rk = key;
        }
        return;
    }

    const type = cellData.type || '';
    const keyLower = cellData.key ? String(cellData.key).toLowerCase() : '';
    const hasKey = !!keyLower;

    let emoji = '';
    if (type === 'ITEM' || type === 'OBSTACLE') {
        emoji = game.getItemGlyph(cellData);
    }

    const useClassicColor =
        game.currentMode === 'classic' &&
        game.classicState.visualV1 &&
        cellData.colorId;

    const colorId = useClassicColor ? cellData.colorId : 0;
    const nextKey = `F|${type}|${keyLower}|${emoji}|${colorId}`;
    if (prevKey === nextKey) return;

    div.className = 'cell filled';

    if (hasKey) {
        div.classList.add('type-' + keyLower);
    } else {
        game.applyColorClass(div, cellData);
    }

    if (colorId) {
        div.classList.add(`classic-color-${colorId}`);
    }

    if (emoji) div.textContent = emoji;
    else if (div.textContent) div.textContent = '';

    div._rk = nextKey;
}
