function implGetFireBossOverlayConfig() {
    if (this.currentMode !== 'adventure' || !this.currentLevelConfig) return null;
    if (this._infoCardOpen) return null;

    const worldConfig = this.getCurrentWorldConfig();
    if (!worldConfig) return null;

    const levelId = this.currentLevelConfig.id;
    const bossId = this.currentLevelConfig.boss?.id || '';

    if (worldConfig.id === 'tutorial_world' && levelId === 0 && bossId === 'guardian') {
        return {
            key: 'guardian_boss_0',
            appClass: 'boss-big-guardian',
            spriteScale: 1.7,
            spriteOffsetY: -20,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(30, 64, 175, 0.55)) drop-shadow(0 0 10px rgba(56, 189, 248, 0.55)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'fire_world') {
        if (levelId === 20 && bossId === 'ignis') {
            return {
                key: 'fire_boss_20',
                appClass: 'boss-big-ignis',
                spriteScale: 2.0,
                spriteOffsetY: -12,
                nameOffsetX: -130,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(185, 28, 28, 0.6)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (levelId === 15 && bossId === 'pyra') {
            return {
                key: 'fire_elite_15',
                appClass: 'boss-big-elite15',
                spriteScale: 1.8,
                spriteOffsetY: -8,
                nameOffsetX: -130,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(185, 28, 28, 0.6)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)) brightness(1.03)',
                nameIntroToHud: true
            };
        }

        if (levelId === 10 && bossId === 'magmor') {
            return {
                key: 'fire_elite_10',
                appClass: 'boss-big-elite10',
                spriteScale: 1.68,
                spriteOffsetY: -12,
                nameOffsetX: -104,
                nameOffsetY: 115,
                spriteFilter: 'drop-shadow(0 8px 14px rgba(185, 28, 28, 0.6)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)) brightness(1.03)',
                nameIntroToHud: true
            };
        }
    }

    if (worldConfig.id === 'forest_world' && levelId === 30 && bossId === 'wolf_alpha') {
        return {
            key: 'forest_elite_30',
            appClass: 'boss-big-forest-elite30',
            spriteScale: 1.6,
            spriteOffsetY: -16,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(6, 95, 70, 0.45)) drop-shadow(0 0 10px rgba(52, 211, 153, 0.4)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'forest_world' && levelId === 35 && bossId === 'aracna') {
        return {
            key: 'forest_elite_35',
            appClass: 'boss-big-forest-elite35',
            spriteScale: 2.15,
            spriteOffsetY: -4,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(6, 95, 70, 0.45)) drop-shadow(0 0 10px rgba(52, 211, 153, 0.4)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'forest_world' && levelId === 40 && bossId === 'ent_ancient') {
        return {
            key: 'forest_boss_40',
            appClass: 'boss-big-forest-boss40',
            spriteScale: 2.46,
            spriteOffsetY: -8,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(6, 95, 70, 0.45)) drop-shadow(0 0 10px rgba(52, 211, 153, 0.4)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'mountain_world' && levelId === 50 && bossId === 'troll') {
        return {
            key: 'mountain_elite_50',
            appClass: 'boss-big-mountain-elite50',
            spriteScale: 1.48,
            spriteOffsetY: -24,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(30, 64, 175, 0.42)) drop-shadow(0 0 10px rgba(96, 165, 250, 0.4)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'mountain_world' && levelId === 55 && bossId === 'giant') {
        return {
            key: 'mountain_elite_55',
            appClass: 'boss-big-mountain-elite55',
            spriteScale: 1.86,
            spriteOffsetY: -12,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(30, 64, 175, 0.42)) drop-shadow(0 0 10px rgba(96, 165, 250, 0.4)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'mountain_world' && levelId === 60 && bossId === 'golem_king') {
        return {
            key: 'mountain_boss_60',
            appClass: 'boss-big-mountain-boss60',
            spriteScale: 2.18,
            spriteOffsetY: -6,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(30, 64, 175, 0.42)) drop-shadow(0 0 10px rgba(96, 165, 250, 0.4)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'desert_world' && levelId === 70 && bossId === 'mummy') {
        return {
            key: 'desert_elite_70',
            appClass: 'boss-big-desert-elite70',
            spriteScale: 1.78,
            spriteOffsetX: -10,
            spriteOffsetY: -10,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(120, 53, 15, 0.48)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.42)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'desert_world' && levelId === 75 && bossId === 'zahrek') {
        return {
            key: 'desert_elite_75',
            appClass: 'boss-big-desert-elite75',
            spriteScale: 2.0,
            spriteOffsetY: -10,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(120, 53, 15, 0.48)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.42)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'desert_world' && levelId === 80 && bossId === 'warlord_grok') {
        return {
            key: 'desert_boss_80',
            appClass: 'boss-big-desert-boss80',
            spriteScale: 1.54,
            spriteOffsetX: -8,
            spriteOffsetY: -24,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(120, 53, 15, 0.48)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.42)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'castle_world' && levelId === 90 && bossId === 'gargoyle') {
        return {
            key: 'castle_elite_90',
            appClass: 'boss-big-castle-elite90',
            spriteScale: 2.24,
            spriteOffsetY: -10,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(76, 5, 25, 0.52)) drop-shadow(0 0 10px rgba(192, 132, 252, 0.4)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'castle_world' && levelId === 95 && bossId === 'knight') {
        return {
            key: 'castle_elite_95',
            appClass: 'boss-big-castle-elite95',
            spriteScale: 2.26,
            spriteOffsetY: -10,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(76, 5, 25, 0.52)) drop-shadow(0 0 10px rgba(192, 132, 252, 0.4)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    if (worldConfig.id === 'castle_world' && levelId === 100 && bossId === 'dark_wizard') {
        return {
            key: 'castle_boss_100',
            appClass: 'boss-big-castle-boss100',
            spriteScale: 1.92,
            spriteOffsetY: -14,
            nameOffsetX: -120,
            nameOffsetY: 115,
            spriteFilter: 'drop-shadow(0 8px 14px rgba(76, 5, 25, 0.52)) drop-shadow(0 0 10px rgba(192, 132, 252, 0.4)) brightness(1.03)',
            nameIntroToHud: true
        };
    }

    return null;
}

function implIsIgnisBossPhase20() {
    const cfg = this.getFireBossOverlayConfig();
    return !!(cfg && cfg.key === 'fire_boss_20');
}

function implUpdateIgnisBossUiOverride() {
    const overlayCfg = this.getFireBossOverlayConfig();
    const shouldApply = !!overlayCfg;
    const bossUiContainer = document.querySelector('.boss-ui-container');
    const bossHpHud = document.getElementById('boss-hp-hud');
    const appRoot = document.getElementById('app');
    const screenGame = document.getElementById('screen-game');
    const overlayClasses = [
        'boss-big-ignis',
        'boss-big-elite15',
        'boss-big-elite10',
        'boss-big-guardian',
        'boss-big-forest-elite30',
        'boss-big-forest-elite35',
        'boss-big-forest-boss40',
        'boss-big-mountain-elite50',
        'boss-big-mountain-elite55',
        'boss-big-mountain-boss60',
        'boss-big-desert-elite70',
        'boss-big-desert-elite75',
        'boss-big-desert-boss80',
        'boss-big-castle-elite90',
        'boss-big-castle-elite95',
        'boss-big-castle-boss100'
    ];
    const activeClass = overlayCfg?.appClass || null;

    if (bossUiContainer) {
        for (let i = 0; i < overlayClasses.length; i++) {
            const cls = overlayClasses[i];
            bossUiContainer.classList.toggle(cls, shouldApply && activeClass === cls);
        }
    }
    if (bossHpHud) {
        for (let i = 0; i < overlayClasses.length; i++) {
            const cls = overlayClasses[i];
            bossHpHud.classList.toggle(cls, shouldApply && activeClass === cls);
        }
    }
    if (appRoot) {
        for (let i = 0; i < overlayClasses.length; i++) {
            const cls = overlayClasses[i];
            appRoot.classList.toggle(cls, shouldApply && activeClass === cls);
        }
    }
    if (screenGame) {
        for (let i = 0; i < overlayClasses.length; i++) {
            const cls = overlayClasses[i];
            screenGame.classList.toggle(cls, shouldApply && activeClass === cls);
        }
    }

    if (shouldApply) {
        this.ensureIgnisSpriteOverlay();
        this.syncIgnisSpriteOverlay();
    } else {
        this.teardownIgnisSpriteOverlay();
    }
}

function implEnsureIgnisSpriteOverlay() {
    if (this._ignisOverlayEl) return;
    const overlay = document.createElement('div');
    overlay.id = 'ignis-sprite-overlay';

    const sprite = document.createElement('div');
    sprite.className = 'ignis-sprite';
    const img = document.createElement('img');
    img.alt = 'Ignis';
    sprite.appendChild(img);

    const nameOverlay = document.createElement('div');
    nameOverlay.className = 'ignis-name-overlay';
    nameOverlay.textContent = 'Ignis';

    overlay.appendChild(sprite);
    overlay.appendChild(nameOverlay);
    document.body.appendChild(overlay);

    this._ignisOverlayEl = overlay;
    this._ignisOverlaySpriteEl = sprite;
    this._ignisOverlayImgEl = img;
    this._ignisOverlayNameEl = nameOverlay;

    if (!this._ignisOverlayResizeBound) {
        this._ignisOverlayResizeBound = () => this.syncIgnisSpriteOverlay();
        window.addEventListener('resize', this._ignisOverlayResizeBound);
    }
}

function implTeardownIgnisSpriteOverlay() {
    if (this._ignisOverlayEl) {
        this._ignisOverlayEl.remove();
    }
    if (this._bossNameIntroAnim) {
        try { this._bossNameIntroAnim.cancel(); } catch (e) {}
        this._bossNameIntroAnim = null;
    }
    if (this._bossNameIntroTimer) {
        clearTimeout(this._bossNameIntroTimer);
        this._bossNameIntroTimer = null;
    }
    if (this._bossNameIntroRetryRaf) {
        cancelAnimationFrame(this._bossNameIntroRetryRaf);
        this._bossNameIntroRetryRaf = 0;
    }
    this.clearBossNameLetterIntro();
    this._bossNameIntroAnimating = false;
    this._bossNameIntroKey = null;
    this._bossNameIntroActiveKey = null;
    this._ignisOverlayEl = null;
    this._ignisOverlaySpriteEl = null;
    this._ignisOverlayImgEl = null;
    this._ignisOverlayNameEl = null;

    const avatar = document.getElementById('boss-hp-avatar') || document.getElementById('boss-target');
    if (avatar) {
        avatar.style.opacity = '';
    }
    const nameEl = document.getElementById('boss-hp-name');
    if (nameEl) {
        nameEl.style.visibility = '';
    }
}

function implSyncIgnisSpriteOverlay() {
    if (!this._ignisOverlayEl || !this._ignisOverlaySpriteEl || !this._ignisOverlayImgEl || !this._ignisOverlayNameEl) return;
    const overlayCfg = this.getFireBossOverlayConfig();
    if (!overlayCfg) {
        this.teardownIgnisSpriteOverlay();
        return;
    }

    const avatar = document.getElementById('boss-hp-avatar') || document.getElementById('boss-target');
    if (!avatar) return;

    const style = getComputedStyle(avatar);
    const spriteUrl = style.getPropertyValue('--boss-sprite-url')?.trim();
    if (!spriteUrl) {
        this._ignisOverlayEl.style.display = 'none';
        avatar.style.opacity = '';
        return;
    }

    const rect = avatar.getBoundingClientRect();
    const sprite = this._ignisOverlaySpriteEl;
    const offsetX = Number.isFinite(overlayCfg.spriteOffsetX) ? overlayCfg.spriteOffsetX : 0;
    const offsetY = Number.isFinite(overlayCfg.spriteOffsetY) ? overlayCfg.spriteOffsetY : -12;
    const scale = Number.isFinite(overlayCfg.spriteScale) ? overlayCfg.spriteScale : 2.0;

    sprite.style.width = `${rect.width * scale}px`;
    sprite.style.height = `${rect.height * scale}px`;
    sprite.style.left = `${rect.left + rect.width / 2 + offsetX}px`;
    sprite.style.top = `${rect.top + rect.height / 2 + offsetY}px`;
    this._ignisOverlayImgEl.src = spriteUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    this._ignisOverlayImgEl.style.filter = overlayCfg.spriteFilter
        || 'drop-shadow(0 8px 14px rgba(185, 28, 28, 0.6)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)) brightness(1.03)';

    const nameEl = document.getElementById('boss-hp-name');
    if (nameEl) {
        const nameRect = nameEl.getBoundingClientRect();
        const nameOffsetX = Number.isFinite(overlayCfg.nameOffsetX) ? overlayCfg.nameOffsetX : -130;
        const nameOffsetY = Number.isFinite(overlayCfg.nameOffsetY) ? overlayCfg.nameOffsetY : 115;
        const bossName = this.currentLevelConfig?.boss?.name || nameEl.textContent || 'Boss';
        const introToHud = overlayCfg.nameIntroToHud === true;
        const introKey = overlayCfg.key || `${this.currentLevelConfig?.id || 'level'}:${this.currentLevelConfig?.boss?.id || 'boss'}`;
        const hpBarEl =
            document.querySelector('#boss-hp-hud .boss-hp-bar-bg') ||
            document.querySelector('#boss-hp-hud .hp-bar-bg');
        const hpBarRect = hpBarEl ? hpBarEl.getBoundingClientRect() : null;
        const finalAdvance = 11.5;

        if (introToHud && (!hpBarRect || hpBarRect.width < 40 || hpBarRect.height < 10)) {
            const avatarCenterX = rect.left + (rect.width / 2);
            const avatarCenterY = rect.top + (rect.height / 2) + (Number.isFinite(overlayCfg.spriteOffsetY) ? overlayCfg.spriteOffsetY : 0);
            this._ignisOverlayNameEl.textContent = bossName;
            this._ignisOverlayNameEl.style.left = `${avatarCenterX}px`;
            this._ignisOverlayNameEl.style.top = `${avatarCenterY}px`;
            this._ignisOverlayNameEl.style.opacity = '1';
            this._ignisOverlayNameEl.style.fontFamily = '"Cinzel", "Poppins", serif';
            this._ignisOverlayNameEl.style.fontSize = 'clamp(1.2rem, 4vw, 2rem)';
            this._ignisOverlayNameEl.style.fontWeight = '600';
            this._ignisOverlayNameEl.style.letterSpacing = '1.6px';
            this._ignisOverlayNameEl.style.textShadow =
                '0 3px 10px rgba(0,0,0,0.85), 0 0 14px rgba(34,211,238,0.45), 0 0 24px rgba(16,185,129,0.45)';
            nameEl.style.visibility = 'hidden';
            if (!this._bossNameIntroRetryRaf) {
                this._bossNameIntroRetryRaf = requestAnimationFrame(() => {
                    this._bossNameIntroRetryRaf = requestAnimationFrame(() => {
                        this._bossNameIntroRetryRaf = 0;
                        this.syncIgnisSpriteOverlay();
                    });
                });
            }
            return;
        }

        let targetX = nameRect.left + nameRect.width / 2 + nameOffsetX;
        if (hpBarRect) {
            const defaultCenterX = hpBarRect.left + Math.min(66, hpBarRect.width * 0.12);
            const fenrirFirstOffset = this.getBossNameFirstVisibleOffset('Fenrir', finalAdvance);
            const defaultFirstLetterX = defaultCenterX + fenrirFirstOffset;
            const thisFirstOffset = this.getBossNameFirstVisibleOffset(bossName, finalAdvance);

            const firstLetterX = Number.isFinite(overlayCfg.nameBarFirstLetterPx) || Number.isFinite(overlayCfg.nameBarFirstLetterRatio)
                ? (
                    hpBarRect.left +
                    Math.min(
                        Number.isFinite(overlayCfg.nameBarFirstLetterPx) ? overlayCfg.nameBarFirstLetterPx : 38,
                        hpBarRect.width * (Number.isFinite(overlayCfg.nameBarFirstLetterRatio) ? overlayCfg.nameBarFirstLetterRatio : 0.09)
                    )
                )
                : defaultFirstLetterX;

            targetX = firstLetterX - thisFirstOffset;
        }
        const targetY = hpBarRect
            ? (hpBarRect.top + hpBarRect.height / 2)
            : (nameRect.top + nameRect.height / 2 + nameOffsetY);

        this._ignisOverlayNameEl.textContent = bossName;

        if (introToHud) {
            if (this._bossNameIntroKey !== overlayCfg.key) {
                this._bossNameIntroKey = overlayCfg.key;
                this._bossNameIntroPlayed = false;
                this._bossNameIntroAnimating = false;
                this._bossNameIntroActiveKey = null;
            }

            if (!this._bossNameIntroPlayed) {
                nameEl.style.visibility = 'hidden';
                if (!this._bossNameIntroAnimating) {
                    this.playBossNameIntroToHud({
                        bossName,
                        targetX,
                        targetY,
                        overlayCfg,
                        nameEl,
                        introKey
                    });
                }
            } else {
                this._ignisOverlayNameEl.style.opacity = '0';
                this._ignisOverlayNameEl.textContent = '';
                nameEl.style.visibility = 'hidden';
            }
        } else {
            this._ignisOverlayNameEl.style.left = `${targetX}px`;
            this._ignisOverlayNameEl.style.top = `${targetY}px`;
            nameEl.style.visibility = 'hidden';
        }
    }

    this._ignisOverlayEl.style.display = 'block';
    avatar.style.opacity = '0';
}

function implClearBossNameLetterIntro() {
    if (this._bossNameLetterAnims && this._bossNameLetterAnims.length > 0) {
        for (let i = 0; i < this._bossNameLetterAnims.length; i++) {
            const anim = this._bossNameLetterAnims[i];
            if (!anim) continue;
            try { anim.cancel(); } catch (e) {}
        }
    }
    this._bossNameLetterAnims = [];

    if (this._bossNameLetterNodes && this._bossNameLetterNodes.length > 0) {
        for (let i = 0; i < this._bossNameLetterNodes.length; i++) {
            const node = this._bossNameLetterNodes[i];
            if (node && node.parentNode) node.parentNode.removeChild(node);
        }
    }
    this._bossNameLetterNodes = [];
}

function implBuildBossNameOffsets(text, advance) {
    const chars = Array.from(String(text || ''));
    const widths = chars.map((ch) => (ch === ' ' ? advance * 0.5 : advance));
    const total = widths.reduce((sum, w) => sum + w, 0);
    let cursor = -total / 2;
    const offsets = widths.map((w) => {
        const x = cursor + (w / 2);
        cursor += w;
        return x;
    });
    return { chars, offsets, widths, total };
}

function implGetBossNameFirstVisibleOffset(text, advance) {
    const layout = this.buildBossNameOffsets(text, advance);
    for (let i = 0; i < layout.chars.length; i++) {
        if (layout.chars[i] !== ' ') return layout.offsets[i];
    }
    return 0;
}

function implPlayBossNameIntroToHud({ bossName, targetX, targetY, overlayCfg, nameEl, introKey }) {
    if (!this._ignisOverlayNameEl) return;
    if (!introKey) return;

    this.clearBossNameLetterIntro();
    const overlayNameEl = this._ignisOverlayNameEl;
    const avatarEl = document.getElementById('boss-hp-avatar') || document.getElementById('boss-target');
    const avatarRect = avatarEl ? avatarEl.getBoundingClientRect() : null;
    const spriteRect = this._ignisOverlaySpriteEl?.getBoundingClientRect();
    const hasAvatarRect = !!(avatarRect && avatarRect.width > 0 && avatarRect.height > 0);
    const hasSpriteRect = !!(spriteRect && spriteRect.width > 0 && spriteRect.height > 0);
    const midX = hasAvatarRect
        ? (avatarRect.left + avatarRect.width / 2)
        : (hasSpriteRect ? (spriteRect.left + spriteRect.width / 2) : targetX);
    const midY = hasAvatarRect
        ? (avatarRect.top + avatarRect.height / 2)
        : (hasSpriteRect ? (spriteRect.top + spriteRect.height / 2) : Math.max(150, window.innerHeight * 0.34));
    const startY = Math.max(78, window.innerHeight * 0.12);
    const dy = startY - targetY;

    overlayNameEl.textContent = bossName || 'Boss';
    overlayNameEl.style.left = `${midX}px`;
    overlayNameEl.style.top = `${midY}px`;
    overlayNameEl.style.fontFamily = '"Cinzel", "Poppins", serif';
    overlayNameEl.style.fontSize = 'clamp(1.4rem, 4.8vw, 2.3rem)';
    overlayNameEl.style.letterSpacing = '2.4px';
    overlayNameEl.style.textShadow =
        '0 3px 10px rgba(0,0,0,0.85), 0 0 14px rgba(34,211,238,0.45), 0 0 24px rgba(16,185,129,0.45)';

    this._bossNameIntroAnimating = true;
    this._bossNameIntroActiveKey = introKey;
    if (this._bossNameIntroAnim) {
        try { this._bossNameIntroAnim.cancel(); } catch (e) {}
        this._bossNameIntroAnim = null;
    }

    const introAnim = overlayNameEl.animate([
        {
            opacity: 0,
            transform: `translate(-50%, -50%) translate(0px, ${dy}px) scale(1.24)`
        },
        {
            opacity: 1,
            transform: `translate(-50%, -50%) translate(0px, ${dy * 0.38}px) scale(1.08)`,
            offset: 0.18
        },
        {
            opacity: 1,
            transform: 'translate(-50%, -50%) translate(0px, 0px) scale(1.02)',
            offset: 0.78
        },
        {
            opacity: 1,
            transform: 'translate(-50%, -50%) translate(0px, 0px) scale(1)',
            offset: 1
        }
    ], {
        duration: 760,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
    });
    this._bossNameIntroAnim = introAnim;

    introAnim.onfinish = () => {
        if (this._bossNameIntroActiveKey !== introKey) return;
        try { introAnim.cancel(); } catch (e) {}
        if (this._bossNameIntroAnim === introAnim) {
            this._bossNameIntroAnim = null;
        }
        this._bossNameIntroTimer = setTimeout(() => {
            if (this._bossNameIntroActiveKey !== introKey) return;
            if (!this._bossNameIntroAnimating) return;
            const initialAdvance = 20;
            const finalAdvance = 11.5;
            const letterDelay = 68;
            const travelDuration = 520;
            const initialLayout = this.buildBossNameOffsets(bossName || 'Boss', initialAdvance);
            const finalLayout = this.buildBossNameOffsets(bossName || 'Boss', finalAdvance);
            const chars = initialLayout.chars;
            const initialOffsets = initialLayout.offsets;
            const finalOffsets = finalLayout.offsets;

            const nodes = [];
            const anims = [];
            let finished = 0;

            for (let i = 0; i < chars.length; i++) {
                const ch = chars[i];
                if (ch === ' ') {
                    continue;
                }

                const letterEl = document.createElement('span');
                letterEl.className = 'ignis-name-letter';
                letterEl.textContent = ch;
                letterEl.style.position = 'absolute';
                letterEl.style.left = `${midX + initialOffsets[i]}px`;
                letterEl.style.top = `${midY}px`;
                letterEl.style.transform = 'translate(-50%, -50%)';
                letterEl.style.pointerEvents = 'none';
                letterEl.style.whiteSpace = 'pre';
                letterEl.style.fontFamily = '"Cinzel", "Poppins", serif';
                letterEl.style.fontSize = 'clamp(1.2rem, 4vw, 2rem)';
                letterEl.style.fontWeight = '400';
                letterEl.style.letterSpacing = '0px';
                letterEl.style.color = '#d1fae5';
                letterEl.style.textShadow =
                    '0 3px 10px rgba(0,0,0,0.85), 0 0 14px rgba(34,211,238,0.45), 0 0 24px rgba(16,185,129,0.45)';
                letterEl.style.zIndex = '65';
                this._ignisOverlayEl.appendChild(letterEl);
                nodes.push(letterEl);

                const endX = targetX + finalOffsets[i];
                const endY = targetY;
                const travelX = endX - (midX + initialOffsets[i]);
                const travelY = endY - midY;
                const moveAnim = letterEl.animate([
                    {
                        opacity: 1,
                        transform: 'translate(-50%, -50%) translate(0px, 0px) scale(1.08)'
                    },
                    {
                        opacity: 1,
                        transform: `translate(-50%, -50%) translate(${travelX}px, ${travelY}px) scale(0.98)`
                    }
                ], {
                    delay: i * letterDelay,
                    duration: travelDuration,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    fill: 'none'
                });
                anims.push(moveAnim);

                moveAnim.onfinish = () => {
                    if (this._bossNameIntroActiveKey !== introKey) return;
                    try { moveAnim.cancel(); } catch (e) {}
                    finished++;
                    const staticLetterEl = document.createElement('span');
                    staticLetterEl.className = 'ignis-name-letter';
                    staticLetterEl.textContent = ch;
                    staticLetterEl.style.position = 'absolute';
                    staticLetterEl.style.left = `${endX}px`;
                    staticLetterEl.style.top = `${endY}px`;
                    staticLetterEl.style.transform = 'translate(-50%, -50%) scale(1)';
                    staticLetterEl.style.pointerEvents = 'none';
                    staticLetterEl.style.whiteSpace = 'pre';
                    staticLetterEl.style.fontFamily = '"Cinzel", "Poppins", serif';
                    staticLetterEl.style.fontSize = 'clamp(0.86rem, 2.4vw, 1.02rem)';
                    staticLetterEl.style.fontWeight = '700';
                    staticLetterEl.style.letterSpacing = '0px';
                    staticLetterEl.style.color = '#d1fae5';
                    staticLetterEl.style.textShadow =
                        '0 2px 6px rgba(0,0,0,0.8), 0 0 8px rgba(15,23,42,0.45)';
                    staticLetterEl.style.zIndex = '65';
                    if (this._ignisOverlayEl) {
                        this._ignisOverlayEl.appendChild(staticLetterEl);
                    }
                    const nodeIdx = nodes.indexOf(letterEl);
                    if (nodeIdx >= 0) nodes[nodeIdx] = staticLetterEl;
                    if (letterEl.parentNode) letterEl.parentNode.removeChild(letterEl);

                    if (finished === nodes.length) {
                        if (this._bossNameIntroActiveKey !== introKey) return;
                        this._bossNameIntroAnimating = false;
                        this._bossNameIntroPlayed = true;
                        this._bossNameIntroActiveKey = null;
                        overlayNameEl.style.opacity = '0';
                        overlayNameEl.textContent = '';
                        if (nameEl) nameEl.style.visibility = 'hidden';
                    }
                };
            }

            this._bossNameLetterNodes = nodes;
            this._bossNameLetterAnims = anims;
            if (nodes.length === 0) {
                if (this._bossNameIntroActiveKey !== introKey) return;
                this._bossNameIntroAnimating = false;
                this._bossNameIntroPlayed = true;
                this._bossNameIntroActiveKey = null;
                overlayNameEl.style.opacity = '0';
                overlayNameEl.textContent = '';
                if (nameEl) nameEl.style.visibility = 'hidden';
            } else {
                requestAnimationFrame(() => {
                    overlayNameEl.style.opacity = '0';
                    overlayNameEl.textContent = '';
                });
            }
            this._bossNameIntroTimer = null;
        }, 360);
    };
}

export function getFireBossOverlayConfig(game) {
    return implGetFireBossOverlayConfig.call(game);
}

export function isIgnisBossPhase20(game) {
    return implIsIgnisBossPhase20.call(game);
}

export function updateIgnisBossUiOverride(game) {
    implUpdateIgnisBossUiOverride.call(game);
}

export function ensureIgnisSpriteOverlay(game) {
    implEnsureIgnisSpriteOverlay.call(game);
}

export function teardownIgnisSpriteOverlay(game) {
    implTeardownIgnisSpriteOverlay.call(game);
}

export function syncIgnisSpriteOverlay(game) {
    implSyncIgnisSpriteOverlay.call(game);
}

export function clearBossNameLetterIntro(game) {
    implClearBossNameLetterIntro.call(game);
}

export function buildBossNameOffsets(game, text, advance) {
    return implBuildBossNameOffsets.call(game, text, advance);
}

export function getBossNameFirstVisibleOffset(game, text, advance) {
    return implGetBossNameFirstVisibleOffset.call(game, text, advance);
}

export function playBossNameIntroToHud(game, payload) {
    implPlayBossNameIntroToHud.call(game, payload);
}
