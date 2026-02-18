import { WORLDS } from '../data/levels.js';

export function startLoadingSequence(game) {
    const bar = document.getElementById('loading-bar-fill');
    const text = document.getElementById('loading-text');
    const screen = document.getElementById('loading-screen');

    if (!bar || !screen) return;

    const messages = [
        game.i18n.t('loading.connecting'),
        game.i18n.t('loading.polishing'),
        game.i18n.t('loading.mapping'),
        game.i18n.t('loading.summoning'),
        game.i18n.t('loading.finalizing')
    ];

    let visualPct = 0;

    const updateLoop = () => {
        if (game.assetsLoaded && visualPct >= 80) {
            visualPct += 5;
        } else if (!game.assetsLoaded && visualPct < 85) {
            visualPct += Math.random() * 2;
        } else if (game.assetsLoaded && visualPct < 80) {
            visualPct += 3;
        }

        if (visualPct > 100) visualPct = 100;

        bar.style.width = visualPct + '%';

        const msgIndex = Math.min(Math.floor((visualPct / 100) * messages.length), messages.length - 1);
        if (text) text.innerText = messages[msgIndex];

        if (visualPct >= 100) {
            if (game.assetsLoaded) {
                setTimeout(() => {
                    screen.classList.add('fade-out');
                    setTimeout(() => {
                        screen.style.display = 'none';
                    }, 800);
                }, 200);
            } else {
                requestAnimationFrame(updateLoop);
            }
        } else {
            requestAnimationFrame(updateLoop);
        }
    };

    requestAnimationFrame(updateLoop);
}

export function setupMenuEvents(game) {
    const unlockAudioOnce = () => {
        if (game.audio && game.audio.unlock) {
            game.audio.unlock();
        }
        document.removeEventListener('click', unlockAudioOnce);
        document.removeEventListener('touchstart', unlockAudioOnce);
    };
    document.addEventListener('click', unlockAudioOnce, { once: true, passive: true });
    document.addEventListener('touchstart', unlockAudioOnce, { once: true, passive: true });

    const bindClick = (id, action) => {
        const el = document.getElementById(id);
        if (el) {
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);

            newEl.addEventListener('click', (e) => {
                if (game.audio) game.audio.playClick();
                action(e);
            });
        }
    };

    const bindGuardianInfo = () => {
        const helpBtn = document.getElementById('gear-help-btn');
        if (helpBtn) {
            const newHelp = helpBtn.cloneNode(true);
            helpBtn.parentNode.replaceChild(newHelp, helpBtn);
            newHelp.addEventListener('click', (e) => {
                e.stopPropagation();
                if (game.audio) game.audio.playClick();
                const gearOverlay = document.getElementById('gear-settings-overlay');
                const gearBtn = document.getElementById('game-gear-btn');
                if (gearOverlay) {
                    gearOverlay.classList.add('hidden');
                    gearOverlay.setAttribute('aria-hidden', 'true');
                }
                if (gearBtn) gearBtn.setAttribute('aria-expanded', 'false');
                game.openInfoCard();
            });
        }

        const overlay = document.getElementById('guardian-info-overlay');
        if (overlay) {
            const newOverlay = overlay.cloneNode(true);
            overlay.parentNode.replaceChild(newOverlay, overlay);

            const closeBtn = newOverlay.querySelector('#guardian-info-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (game.audio) game.audio.playClick();
                    game.closeInfoCard();
                });
            }

            newOverlay.addEventListener('click', (e) => {
                if (e.target === newOverlay) game.closeInfoCard();
            });
        }
    };

    const bindGearMenu = () => {
        const gearBtn = document.getElementById('game-gear-btn');
        const overlay = document.getElementById('gear-settings-overlay');
        const closeBtn = document.getElementById('gear-settings-close');
        const toggleMusic = document.getElementById('gear-toggle-music');
        const toggleSfx = document.getElementById('gear-toggle-sfx');
        if (!gearBtn || !overlay) return;

        const syncToggles = () => {
            if (toggleMusic) toggleMusic.checked = !!game.settings.music;
            if (toggleSfx) toggleSfx.checked = !!game.settings.sfx;
        };

        const closePanel = () => {
            overlay.classList.add('hidden');
            overlay.setAttribute('aria-hidden', 'true');
            gearBtn.setAttribute('aria-expanded', 'false');
        };

        const openPanel = () => {
            syncToggles();
            overlay.classList.remove('hidden');
            overlay.setAttribute('aria-hidden', 'false');
            gearBtn.setAttribute('aria-expanded', 'true');
        };

        const togglePanel = (e) => {
            e.stopPropagation();
            if (game.audio) game.audio.playClick();
            if (overlay.classList.contains('hidden')) openPanel();
            else closePanel();
        };

        const newGear = gearBtn.cloneNode(true);
        gearBtn.parentNode.replaceChild(newGear, gearBtn);
        newGear.addEventListener('click', togglePanel);

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (game.audio) game.audio.playClick();
                closePanel();
            });
        }

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePanel();
        });

        if (toggleMusic) {
            toggleMusic.addEventListener('change', (e) => {
                game.settings.music = e.target.checked;
                game.saveSettings();
                const settingsToggle = document.getElementById('toggle-music');
                if (settingsToggle) settingsToggle.checked = game.settings.music;
            });
        }

        if (toggleSfx) {
            toggleSfx.addEventListener('change', (e) => {
                game.settings.sfx = e.target.checked;
                game.saveSettings();
                const settingsToggle = document.getElementById('toggle-sfx');
                if (settingsToggle) settingsToggle.checked = game.settings.sfx;
            });
        }
    };

    bindClick('btn-mode-casual', () => game.startClassicMode());
    bindClick('btn-mode-adventure', () => game.checkAdventureIntro());
    bindClick('btn-mode-blitz', () => game.startBlitzMode());
    bindClick('btn-back-menu', () => game.showScreen(game.screenMenu));
    bindClick('btn-quit-game', () => game.showScreen(game.screenMenu));

    bindClick('btn-next-slide', () => {
        game.storyStep++;
        game.renderStorySlide();
    });

    bindClick('btn-skip-story', () => {
        const savedClass = localStorage.getItem('blocklands_player_class');
        if (game._storyReplayMode || savedClass) {
            game.showWorldSelect();
        } else {
            game.showHeroSelection();
        }
    });

    bindClick('btn-start-adventure', () => {
        localStorage.setItem('blocklands_intro_seen', 'true');
        game.showWorldSelect();
    });

    bindClick('btn-restart-over', () => game.retryGame());

    bindClick('btn-quit-game', () => {
        if (game.audio) game.audio.stopMusic();

        if (game.currentMode === 'blitz') {
            if (game.blitz) game.blitz.exit();
            game.showScreen(game.screenMenu);
        } else if (game.currentMode === 'adventure') {
            const currentWorld = WORLDS.find((w) => w.levels.some((l) => l.id === game.currentLevelConfig?.id));
            if (currentWorld && currentWorld.id !== 'tutorial_world') {
                game.showScreen(game.screenLevels);
                game.openWorldMap(currentWorld);
            } else {
                game.showWorldSelect();
            }
        } else {
            game.showScreen(game.screenMenu);
        }
    });

    bindClick('pwr-bomb', () => game.activatePowerUp('bomb'));
    bindClick('pwr-rotate', () => game.activatePowerUp('rotate'));
    bindClick('pwr-swap', () => game.activatePowerUp('swap'));

    bindGuardianInfo();
    bindGearMenu();

    const btnNextLevel = document.getElementById('btn-next-level');
    if (btnNextLevel) {
        const newBtn = btnNextLevel.cloneNode(true);
        btnNextLevel.parentNode.replaceChild(newBtn, btnNextLevel);
        newBtn.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            game.modalWin.classList.add('hidden');

            if (game.currentMode === 'adventure') {
                const currentWorld = WORLDS.find((w) => w.levels.some((l) => l.id === game.currentLevelConfig?.id));
                if (currentWorld) {
                    const levelId = game.currentLevelConfig?.id;
                    const seenKey = 'blocklands_story_fire_ignis_seen';
                    if (levelId === 20 && localStorage.getItem(seenKey) !== 'true') {
                        localStorage.setItem(seenKey, 'true');
                        game.showSingleStory({
                            textKey: 'story_fire_ignis_aftermath',
                            imageSrc: 'assets/img/story_fire_ignis_aftermath.webp',
                            onDone: () => {
                                game.showScreen(game.screenLevels);
                                game.openWorldMap(currentWorld);
                            }
                        });
                        return;
                    }
                    game.showScreen(game.screenLevels);
                    game.openWorldMap(currentWorld);
                } else {
                    game.showWorldSelect();
                }
            } else {
                game.retryGame();
            }
        });
    }

    const btnVictoryBack = document.getElementById('btn-victory-back');
    if (btnVictoryBack) {
        const newBtn = btnVictoryBack.cloneNode(true);
        btnVictoryBack.parentNode.replaceChild(newBtn, btnVictoryBack);
        newBtn.addEventListener('click', () => {
            if (game.audio) game.audio.playBack();
            game.modalWin.classList.add('hidden');
            if (game.currentMode === 'adventure') {
                game.showScreen(game.screenLevels);
                const currentWorld = WORLDS.find((w) => w.levels.some((l) => l.id === game.currentLevelConfig?.id));
                if (currentWorld) game.openWorldMap(currentWorld);
                else game.showWorldSelect();
            } else {
                game.showScreen(game.screenMenu);
            }
        });
    }

    const btnEn = document.getElementById('btn-lang-en');
    const btnPt = document.getElementById('btn-lang-pt');
    const updateLangUI = () => {
        if (btnEn && btnPt) {
            btnEn.style.background = game.i18n.currentLang === 'en' ? '#fbbf24' : 'rgba(255,255,255,0.1)';
            btnEn.style.color = game.i18n.currentLang === 'en' ? '#000' : '#fff';
            btnPt.style.background = game.i18n.currentLang === 'pt-BR' ? '#fbbf24' : 'rgba(255,255,255,0.1)';
            btnPt.style.color = game.i18n.currentLang === 'pt-BR' ? '#000' : '#fff';
        }
    };
    updateLangUI();

    if (btnEn) btnEn.addEventListener('click', async () => {
        if (game.audio) game.audio.playClick();
        await game.i18n.changeLanguage('en');
        updateLangUI();
        if (game.screenLevels.classList.contains('active-screen')) game.showWorldSelect();
    });

    if (btnPt) btnPt.addEventListener('click', async () => {
        if (game.audio) game.audio.playClick();
        await game.i18n.changeLanguage('pt-BR');
        updateLangUI();
        if (game.screenLevels.classList.contains('active-screen')) game.showWorldSelect();
    });

    const btnOpen = document.getElementById('btn-open-sidebar');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('menu-overlay');
    const btnClose = document.getElementById('btn-close-sidebar');
    const toggleSidebar = (show) => {
        if (show) {
            sidebar.classList.add('open');
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('visible'), 10);
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    };
    if (btnOpen) btnOpen.addEventListener('click', () => { if (game.audio) game.audio.playClick(); toggleSidebar(true); });
    if (btnClose) btnClose.addEventListener('click', () => { if (game.audio) game.audio.playBack(); toggleSidebar(false); });
    if (overlay) overlay.addEventListener('click', () => { if (game.audio) game.audio.playBack(); toggleSidebar(false); });

    game.setupSettingsLogic();

    const btnSettings = document.querySelector('.sidebar-item span[data-i18n="sidebar.settings"]')?.parentNode;
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            toggleSidebar(false);
            game.showScreen(game.screenSettings);
        });
    }

    const btnAchievements = document.getElementById('btn-achievements');
    if (btnAchievements) {
        btnAchievements.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            toggleSidebar(false);
            game.showAchievementsScreen();
        });
    }

    const btnAchievementsBack = document.getElementById('btn-achievements-back');
    if (btnAchievementsBack) {
        btnAchievementsBack.addEventListener('click', () => {
            if (game.audio) game.audio.playBack();
            game.showScreen(game.screenMenu);
        });
    }

    const btnStore = document.querySelector('.sidebar-item span[data-i18n="sidebar.store"]')?.parentNode;
    if (btnStore) {
        btnStore.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            toggleSidebar(false);
            game.showStoreScreen();
        });
    }

    const btnStoreBack = document.getElementById('btn-store-back');
    if (btnStoreBack) {
        btnStoreBack.addEventListener('click', () => {
            if (game.audio) game.audio.playBack();
            game.showScreen(game.screenMenu);
        });
    }

    game.setupStoreListeners();
    game.setupStoreTabs();
}

export function setupSettingsLogic(game) {
    const toggleMusic = document.getElementById('toggle-music');
    const toggleSfx = document.getElementById('toggle-sfx');
    const toggleHaptics = document.getElementById('toggle-haptics');
    const togglePerformance = document.getElementById('toggle-performance');
    const btnReset = document.getElementById('btn-reset-progress');
    const btnBack = document.getElementById('btn-settings-back');
    const btnLangEn = document.getElementById('btn-lang-en');
    const btnLangPt = document.getElementById('btn-lang-pt');
    const btnDiagOpen = document.getElementById('btn-diag-open');
    const btnDiagCopy = document.getElementById('btn-diag-copy');
    const btnDiagClear = document.getElementById('btn-diag-clear');
    const diagOutput = document.getElementById('diag-output');

    if (toggleMusic) toggleMusic.checked = game.settings.music;
    if (toggleSfx) toggleSfx.checked = game.settings.sfx;
    if (toggleHaptics) toggleHaptics.checked = game.settings.haptics;
    if (togglePerformance) togglePerformance.value = game.settings.performanceMode || 'auto';

    const updateLangVisuals = () => {
        if (game.i18n.currentLang === 'en') {
            btnLangEn?.classList.add('active');
            btnLangPt?.classList.remove('active');
        } else {
            btnLangPt?.classList.add('active');
            btnLangEn?.classList.remove('active');
        }
    };
    updateLangVisuals();

    if (game._settingsLogicBound) return;
    game._settingsLogicBound = true;

    if (toggleMusic) toggleMusic.addEventListener('change', (e) => {
        game.settings.music = e.target.checked;
        game.saveSettings();
    });
    if (toggleSfx) toggleSfx.addEventListener('change', (e) => {
        game.settings.sfx = e.target.checked;
        game.saveSettings();
    });
    if (toggleHaptics) toggleHaptics.addEventListener('change', (e) => {
        game.settings.haptics = e.target.checked;
        game.saveSettings();
        if (game.settings.haptics && game.audio) game.audio.vibrate(50);
    });
    if (togglePerformance) togglePerformance.addEventListener('change', (e) => {
        const nextMode = String(e.target.value || 'auto');
        game.settings.performanceMode = (nextMode === 'quality' || nextMode === 'stable60') ? nextMode : 'auto';
        game.saveSettings();
    });

    if (btnReset) btnReset.addEventListener('click', () => {
        if (confirm(game.i18n.t('settings.reset_confirm'))) {
            localStorage.clear();
            location.reload();
        }
    });

    if (btnBack) btnBack.addEventListener('click', () => {
        if (game.audio) game.audio.playBack();
        game.showScreen(game.screenMenu);
    });

    if (btnLangEn) btnLangEn.addEventListener('click', async () => {
        if (game.audio) game.audio.playClick();
        await game.i18n.changeLanguage('en');
        updateLangVisuals();
    });

    if (btnLangPt) btnLangPt.addEventListener('click', async () => {
        if (game.audio) game.audio.playClick();
        await game.i18n.changeLanguage('pt-BR');
        updateLangVisuals();
    });

    const buildDiagAndShow = () => {
        if (!diagOutput) return '';
        const report = game.buildDiagnosticsReport();
        diagOutput.value = report;
        diagOutput.classList.remove('hidden');
        return report;
    };

    if (btnDiagOpen) {
        btnDiagOpen.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            buildDiagAndShow();
        });
    }
    if (btnDiagCopy) {
        btnDiagCopy.addEventListener('click', async () => {
            if (game.audio) game.audio.playClick();
            const report = buildDiagAndShow();
            await game.copyDiagnosticsReport(report);
        });
    }
    if (btnDiagClear) {
        btnDiagClear.addEventListener('click', () => {
            if (game.audio) game.audio.playBack();
            localStorage.removeItem('blocklands_diag_events');
            if (diagOutput) {
                diagOutput.value = '';
                diagOutput.classList.add('hidden');
            }
            game.showStoreToast('Eventos de diagnostico limpos.', 'success');
        });
    }
}

export function buildDiagnosticsReport(game) {
    const now = new Date().toISOString();
    const profile = game.performanceProfile || 'auto';
    const perfMode = game.settings?.performanceMode || 'auto';
    const fps = Math.round(game._fpsSmoothed || 0);
    const world = game.getCurrentWorld() || 'none';
    const level = game.currentLevelConfig?.id ?? null;
    const mode = game.currentMode || 'unknown';
    const crystals = game.crystals || 0;
    const lang = game.i18n?.currentLang || 'unknown';
    const ua = navigator.userAgent || '';
    const diagEventsRaw = localStorage.getItem('blocklands_diag_events');
    let diagEvents = [];
    try { diagEvents = diagEventsRaw ? JSON.parse(diagEventsRaw) : []; } catch (_) { diagEvents = []; }

    const lines = [];
    lines.push('Block Lands Diagnostic Report');
    lines.push(`time_utc=${now}`);
    lines.push(`mode=${mode}`);
    lines.push(`world=${world}`);
    lines.push(`level=${level}`);
    lines.push(`language=${lang}`);
    lines.push(`crystals=${crystals}`);
    lines.push(`perf_mode=${perfMode}`);
    lines.push(`perf_profile=${profile}`);
    lines.push(`fps_smoothed=${fps}`);
    lines.push(`runtime_downgrade=${game._runtimePerfDowngrade ? '1' : '0'}`);
    lines.push(`display=${window.innerWidth}x${window.innerHeight}`);
    lines.push(`pixel_ratio=${window.devicePixelRatio || 1}`);
    lines.push(`user_agent=${ua}`);
    lines.push(`diag_events_count=${diagEvents.length}`);
    lines.push('diag_events=');
    lines.push(JSON.stringify(diagEvents, null, 2));
    return lines.join('\n');
}

export async function copyDiagnosticsReport(game, report) {
    const text = report || game.buildDiagnosticsReport();
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        game.showStoreToast('Relatorio copiado.', 'success');
    } catch (_) {
        game.showStoreToast('Falha ao copiar relatorio.', 'error');
    }
}
