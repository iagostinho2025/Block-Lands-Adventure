export function showAchievementsScreen(game, initialFilter = 'classic') {
    game.showScreen(game.screenAchievements);
    game.toggleGlobalHeader(false);

    if (!game.achievements) return;

    game.currentAchievementFilter = initialFilter;

    const tabs = document.querySelectorAll('.achievements-tab');
    tabs.forEach((tab) => {
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
    });

    document.querySelectorAll('.achievements-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.achievements-tab').forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            game.currentAchievementFilter = filter;

            game.updateAchievementStats(filter);
            game.renderAchievementsList(filter);

            if (game.audio) game.audio.playClick();
        });
    });

    game.updateAchievementStats(initialFilter);
    game.renderAchievementsList(initialFilter);
}

export function updateAchievementStats(game, mode) {
    if (!game.achievements) return;

    const allAchievements = game.achievements.getAll();
    const filtered = allAchievements.filter((ach) => ach.mode === mode);

    const total = filtered.length;
    const unlocked = filtered.filter((ach) => ach.unlocked).length;
    const percentage = total > 0 ? Math.floor((unlocked / total) * 100) : 0;

    const unlockedEl = document.getElementById('achievements-unlocked');
    const totalEl = document.getElementById('achievements-total');
    const progressFillEl = document.getElementById('achievements-progress-fill');

    if (unlockedEl) unlockedEl.textContent = unlocked;
    if (totalEl) totalEl.textContent = total;
    if (progressFillEl) progressFillEl.style.width = percentage + '%';
}

export function renderAchievementsList(game, mode) {
    const listEl = document.getElementById('achievements-list');
    if (!listEl || !game.achievements) return;

    const allAchievements = game.achievements.getAll();
    const filtered = allAchievements.filter((ach) => ach.mode === mode);

    listEl.innerHTML = filtered.map((ach) => {
        const isUnlocked = ach.unlocked;
        const progress = ach.progress || 0;
        const target = ach.requirement.target || 1;
        const percentage = Math.min((progress / target) * 100, 100);

        const rewardMap = { bronze: 10, silver: 25, gold: 50, platinum: 100 };
        const rewardAmount = rewardMap[ach.tier] || 10;

        return `
                <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}" data-category="${ach.category}">
                    <div class="achievement-item-icon">${ach.icon}</div>
                    <div class="achievement-item-content">
                        <div class="achievement-item-header">
                            <div class="achievement-item-title">${game.i18n.t(ach.title_key)}</div>
                            <div class="achievement-item-tier ${ach.tier}">${ach.tier}</div>
                        </div>
                        <div class="achievement-item-desc">${game.i18n.t(ach.desc_key)}</div>
                        ${!isUnlocked ? `
                            <div class="achievement-item-progress">
                                <div class="achievement-progress-bar-small">
                                    <div class="achievement-progress-fill-small" style="width: ${percentage}%"></div>
                                </div>
                                <div class="achievement-progress-text-small">${progress}/${target}</div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="achievement-item-reward">
                        <div class="achievement-reward-icon">\u{1F48E}</div>
                        <div class="achievement-reward-amount">x${rewardAmount}</div>
                    </div>
                    ${isUnlocked ? '<div class="achievement-item-checkmark">\u{2713}</div>' : ''}
                </div>
            `;
    }).join('');
}

export function showStoreScreen(game) {
    game.showScreen(game.screenStore);
    game.toggleGlobalHeader(false);
    game.updateCrystalDisplay();
    game.updateStoreUnlockablesUI();
}
