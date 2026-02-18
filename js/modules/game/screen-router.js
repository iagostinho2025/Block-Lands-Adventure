export function showScreen(game, screenEl) {
    if (screenEl === game.screenGame) game.startFpsMonitor();
    else game.stopFpsMonitor();

    if (game.currentMode === 'blitz' && screenEl !== game.screenGame && game.blitz) {
        game.blitz.exit();
    }
    if (screenEl !== game.screenGame) {
        game.teardownIgnisSpriteOverlay();
    }
    if (game.screenGame.classList.contains('active-screen')) {
        if (game.audio) game.audio.stopMusic();
    }

    [
        game.screenMenu,
        game.screenLevels,
        game.screenStory,
        game.screenGame,
        game.screenSettings,
        game.screenHeroSelect,
        game.screenCampfire,
        game.screenAchievements,
        game.screenStore
    ].forEach((s) => {
        if (s) {
            s.classList.remove('active-screen');
            s.classList.add('hidden');
        }
    });

    if (screenEl === game.screenMenu) {
        toggleGlobalHeader(false);
    } else if (
        screenEl === game.screenStory ||
        screenEl === game.screenHeroSelect ||
        screenEl === game.screenCampfire
    ) {
        toggleGlobalHeader(false);
    } else {
        toggleGlobalHeader(true);
    }

    if (screenEl) {
        screenEl.classList.remove('hidden');
        screenEl.classList.add('active-screen');
    }

    const app = document.getElementById('app');
    if (app) {
        app.classList.remove(
            'is-screen-home',
            'is-screen-classic',
            'is-screen-adventure',
            'is-screen-blitz',
            'is-screen-achievements',
            'is-screen-masters-store',
            'is-screen-how-to-play',
            'is-screen-settings'
        );

        if (screenEl === game.screenMenu) {
            app.classList.add('is-screen-home');
        } else if (screenEl === game.screenGame) {
            if (game.currentMode === 'adventure') {
                app.classList.add('is-screen-adventure');
            } else if (game.currentMode === 'blitz') {
                app.classList.add('is-screen-blitz');
            } else {
                app.classList.add('is-screen-classic');
                game.updateClassicThemeClass();
            }
        } else if (screenEl === game.screenAchievements) {
            app.classList.add('is-screen-achievements');
        } else if (screenEl === game.screenSettings) {
            app.classList.add('is-screen-settings');
        }
    }

    // Layout pode mudar com troca de tela; invalida metricas do tabuleiro
    game._boardMetricsDirty = true;
}

export function toggleGlobalHeader(show) {
    const levelHeader = document.querySelector('.level-header');
    if (!levelHeader) return;
    if (show) levelHeader.classList.remove('hidden-header');
    else levelHeader.classList.add('hidden-header');
}
