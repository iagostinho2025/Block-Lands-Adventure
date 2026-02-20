export function openWorldMap(game, worldConfig) {
    const container = document.getElementById('levels-container');
    if (!container) return;

    game.toggleGlobalHeader(false);

    container.className = '';
    container.style = '';
    container.style.display = 'block';

    container.innerHTML = `
            <button id="btn-map-back" class="btn-aaa-back pos-absolute-top-left" style="z-index: 2000;">
                <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            
            <div id="world-map-bg" class="world-map-container full-screen-mode">
            </div>
        `;

    const mapBg = document.getElementById('world-map-bg');
    game.setWorldMapBackground(mapBg, worldConfig);

    const mapBackBtn = document.getElementById('btn-map-back');
    if (mapBackBtn) {
        mapBackBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (game.audio) game.audio.playBack();

            container.innerHTML = '';
            game.showWorldSelect();
        });
    }

    const currentSave = game.loadProgress();
    const completedLevels = new Set(
        (typeof game.getCompletedAdventureLevels === 'function')
            ? game.getCompletedAdventureLevels()
            : []
    );
    const useDebugUnlock = (typeof game.usesAdventureUnlockDebug === 'function')
        ? game.usesAdventureUnlockDebug()
        : false;

    const queuePriorityBossPreload = () => {
        if (!worldConfig || typeof game.preloadImageList !== 'function') return;

        const bossLevels = (worldConfig.levels || [])
            .filter((level) => level && level.type === 'boss')
            .sort((a, b) => a.id - b.id);
        if (bossLevels.length === 0) return;

        const worldId = worldConfig.id || '';
        const worldShortMap = {
            tutorial_world: 'guardian',
            fire_world: 'fire',
            forest_world: 'forest',
            mountain_world: 'mountain',
            desert_world: 'desert',
            castle_world: 'castle'
        };
        const worldShort = worldShortMap[worldId];
        if (!worldShort) return;

        const firstLockedOrCurrent = bossLevels.findIndex((level) => level.id >= currentSave);
        const nextIdx = firstLockedOrCurrent === -1
            ? Math.max(0, bossLevels.length - 1)
            : firstLockedOrCurrent;
        const selected = bossLevels.slice(nextIdx, nextIdx + 2);
        if (selected.length === 0) selected.push(bossLevels[bossLevels.length - 1]);

        const assetSet = new Set();
        for (let i = 0; i < selected.length; i++) {
            const level = selected[i];

            if (worldId === 'tutorial_world') {
                assetSet.add('assets/enemies/guardian/boss.webp');
                assetSet.add('assets/backgrounds/guardian/boss.webp');
                continue;
            }

            const levelIndex = bossLevels.findIndex((entry) => entry.id === level.id);
            let spriteFile = 'boss';
            if (levelIndex === 0) spriteFile = 'elite_10';
            else if (levelIndex === 1) spriteFile = 'elite_15';

            assetSet.add(`assets/enemies/${worldShort}_world/${spriteFile}.webp`);
            assetSet.add(`assets/backgrounds/${worldShort}/${spriteFile === 'boss' ? 'boss' : 'elite'}.webp`);
        }

        const assets = Array.from(assetSet);
        if (assets.length === 0) return;

        const run = () => { game.preloadImageList(assets); };
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(run, { timeout: 1200 });
        } else {
            setTimeout(run, 80);
        }
    };
    queuePriorityBossPreload();

    const createSvgButton = (levelData) => {
        const pos = levelData.mapPos || { x: 50, y: 50 };
        const levelNum = levelData.id;
        const isFireWorld = worldConfig?.id === 'fire_world';

        const isUnlocked = (typeof game.isAdventureLevelUnlocked === 'function')
            ? game.isAdventureLevelUnlocked(levelData.id)
            : (levelData.id <= currentSave);
        let state = 'locked';
        const isCompleted = useDebugUnlock
            ? completedLevels.has(levelData.id)
            : (completedLevels.has(levelData.id) || levelData.id < currentSave);

        if (!isUnlocked) state = 'locked';
        else if (isCompleted) state = 'completed';
        else if (levelData.id === currentSave) state = 'current';
        else state = 'unlocked';

        let type = 'normal';
        let emojiIcon = null;

        if (levelData.type === 'boss') {
            if (levelData.id === 20) {
                type = 'final-boss';
                emojiIcon = '\u{1F451}';
            } else {
                type = 'elite';
                emojiIcon = '\u{1F480}';
            }
        }

        if (state === 'current' && emojiIcon === null) {
            emojiIcon = '\u{2694}\u{FE0F}';
        }

        let phaseSpritePath = '';
        if (isFireWorld) {
            if (type === 'final-boss') phaseSpritePath = 'assets/enemies/fire_world/phase_boss.webp';
            else if (type === 'elite') phaseSpritePath = 'assets/enemies/fire_world/phase_elite.webp';
            else phaseSpritePath = 'assets/enemies/fire_world/phase_normal.webp';
        }

        const onNodeClick = () => {
            if (state === 'locked') {
                if (game.audio) game.audio.vibrate(50);
                return;
            }
            if (game.audio) game.audio.playClick();
            game.toggleGlobalHeader(true);
            const levelsContainer = document.getElementById('levels-container');
            levelsContainer.style.display = 'none';
            document.body.className = '';
            game.startAdventureLevel(levelData);
        };

        if (isFireWorld) {
            const spriteBtn = document.createElement('button');
            spriteBtn.type = 'button';

            let cssClasses = `map-node-sprite floating-node ${state} ${type}`;
            if (type === 'normal' && levelNum >= 1 && levelNum <= 5) {
                cssClasses += ' very-early-normal';
            }
            if (type === 'normal' && levelNum >= 1 && levelNum <= 9) {
                cssClasses += ' early-normal';
            }
            if (state === 'current') cssClasses += ' current';
            spriteBtn.className = cssClasses;
            spriteBtn.style.left = `${pos.x}%`;
            spriteBtn.style.top = `${pos.y}%`;
            spriteBtn.style.setProperty('--i', Math.random() * 5);
            if (phaseSpritePath) {
                const resolvedSpritePath = new URL(phaseSpritePath, window.location.href).href;
                spriteBtn.style.setProperty('--node-sprite', `url('${resolvedSpritePath}')`);
            }
            spriteBtn.setAttribute('aria-label', `Fase ${levelNum}`);

            spriteBtn.addEventListener('click', onNodeClick);
            return spriteBtn;
        }

        const palettes = {
            'normal': { top: '#2563eb', bot: '#172554', stroke: '#60a5fa' },
            'elite': { top: '#dc2626', bot: '#7f1d1d', stroke: '#fca5a5' },
            'final-boss': { top: '#f59e0b', bot: '#92400e', stroke: '#fcd34d' },
            'completed': { top: '#475569', bot: '#0f172a', stroke: '#1e293b' }
        };

        const p = (state === 'completed') ? palettes.completed : palettes[type];

        let finalStroke = p.stroke;
        let finalStrokeWidth = '2';

        if (state === 'current') {
            finalStroke = '#fbbf24';
            finalStrokeWidth = '4';
        }

        const svgNS = 'http://www.w3.org/2000/svg';
        const svgBtn = document.createElementNS(svgNS, 'svg');
        const uniqueId = `btn-${levelData.id}`;

        let cssClasses = `map-node-svg style-shield floating-node ${state} ${type}`;

        if (state === 'current') cssClasses += ' current';

        svgBtn.setAttribute('class', cssClasses);
        svgBtn.setAttribute('viewBox', '0 0 100 100');
        svgBtn.style.left = `${pos.x}%`;
        svgBtn.style.top = `${pos.y}%`;

        svgBtn.style.setProperty('--i', Math.random() * 5);

        const defs = document.createElementNS(svgNS, 'defs');
        defs.innerHTML = `
                <linearGradient id="gradMain-${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${p.top}" stop-opacity="1" />
                    <stop offset="100%" stop-color="${p.bot}" stop-opacity="1" />
                </linearGradient>
                <linearGradient id="gradShine-${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="white" stop-opacity="0.3" />
                    <stop offset="60%" stop-color="white" stop-opacity="0" />
                </linearGradient>
                <radialGradient id="gradShadow-${uniqueId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stop-color="black" stop-opacity="0.6" />
                    <stop offset="100%" stop-color="black" stop-opacity="0" />
                </radialGradient>
                <clipPath id="clipShield-${uniqueId}">
                    <path d="M 50 5 L 90 20 v 25 c 0 30 -25 50 -40 55 c -15 -5 -40 -25 -40 -55 v -25 Z"/>
                </clipPath>
            `;
        svgBtn.appendChild(defs);

        const shadow = document.createElementNS(svgNS, 'ellipse');
        shadow.setAttribute('cx', '50');
        shadow.setAttribute('cy', '95');
        shadow.setAttribute('rx', '25');
        shadow.setAttribute('ry', '6');
        shadow.setAttribute('fill', state === 'completed' ? 'rgba(0,0,0,0.8)' : `url(#gradShadow-${uniqueId})`);
        svgBtn.appendChild(shadow);

        const shieldPath = 'M 50 5 L 90 20 v 25 c 0 30 -25 50 -40 55 c -15 -5 -40 -25 -40 -55 v -25 Z';
        const pathBase = document.createElementNS(svgNS, 'path');
        pathBase.setAttribute('d', shieldPath);
        pathBase.setAttribute('fill', `url(#gradMain-${uniqueId})`);
        pathBase.setAttribute('stroke', finalStroke);
        pathBase.setAttribute('stroke-width', finalStrokeWidth);
        svgBtn.appendChild(pathBase);

        if (isFireWorld && phaseSpritePath && state !== 'completed') {
            const iconImage = document.createElementNS(svgNS, 'image');
            iconImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', phaseSpritePath);
            iconImage.setAttribute('x', '20');
            iconImage.setAttribute('y', '18');
            iconImage.setAttribute('width', '60');
            iconImage.setAttribute('height', '60');
            iconImage.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            iconImage.setAttribute('clip-path', `url(#clipShield-${uniqueId})`);
            iconImage.style.pointerEvents = 'none';
            svgBtn.appendChild(iconImage);
        }

        if (state === 'completed') {
            const crackD = 'M 35 30 L 50 50 L 40 65 M 60 40 L 50 50 L 55 70';

            const crackShadow = document.createElementNS(svgNS, 'path');
            crackShadow.setAttribute('d', crackD);
            crackShadow.setAttribute('fill', 'none');
            crackShadow.setAttribute('stroke', 'black');
            crackShadow.setAttribute('stroke-width', '4');
            crackShadow.setAttribute('opacity', '0.8');
            svgBtn.appendChild(crackShadow);

            const crackHighlight = document.createElementNS(svgNS, 'path');
            crackHighlight.setAttribute('d', crackD);
            crackHighlight.setAttribute('fill', 'none');
            crackHighlight.setAttribute('stroke', 'rgba(255,255,255,0.3)');
            crackHighlight.setAttribute('stroke-width', '1');
            crackHighlight.setAttribute('transform', 'translate(1, 1)');
            svgBtn.appendChild(crackHighlight);
        }

        const shinePath = 'M 50 10 L 80 22 v 20 c 0 20 -15 35 -30 40 c -15 -5 -30 -20 -30 -40 v -20 Z';
        const pathShine = document.createElementNS(svgNS, 'path');
        pathShine.setAttribute('d', shinePath);
        pathShine.setAttribute('fill', `url(#gradShine-${uniqueId})`);
        pathShine.style.pointerEvents = 'none';
        svgBtn.appendChild(pathShine);

        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', '50');
        text.setAttribute('y', '62');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'glossy-text');
        text.style.pointerEvents = 'none';

        text.style.fill = (state === 'completed') ? '#94a3b8' : '#ffffff';
        text.style.fontSize = isFireWorld ? '16px' : (emojiIcon ? '34px' : '28px');
        text.style.textShadow = '0 2px 4px rgba(0,0,0,0.8)';
        if (isFireWorld) {
            text.setAttribute('y', '86');
        }

        text.textContent = isFireWorld ? levelNum : (emojiIcon || levelNum);
        svgBtn.appendChild(text);

        svgBtn.addEventListener('click', onNodeClick);

        return svgBtn;
    };

    worldConfig.levels.forEach((level) => {
        mapBg.appendChild(createSvgButton(level));
    });
}
