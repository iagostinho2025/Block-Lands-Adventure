import { WORLDS } from '../data/levels.js';

export function showCampfireScene(game) {
    const screen = document.getElementById('screen-campfire');
    const textEl = document.getElementById('campfire-text');
    const btnTextEl = document.getElementById('campfire-btn-text');

    if (!screen) return;

    const bgImage = (game.playerClass === 'warrior')
        ? 'assets/img/bg_campfire_warrior.webp'
        : 'assets/img/bg_campfire_mage.webp';
    game.preloadImage(bgImage);

    screen.style.backgroundImage = `url('${bgImage}')`;

    if (textEl) textEl.innerHTML = game.i18n.t('campfire.text').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fbbf24">$1</strong>');
    if (btnTextEl) btnTextEl.innerText = game.i18n.t('campfire.btn_start');

    game.showScreen(screen);
    game.toggleGlobalHeader(false);

    const btnStart = document.getElementById('btn-start-boss');
    if (btnStart) {
        const newBtn = btnStart.cloneNode(true);
        btnStart.parentNode.replaceChild(newBtn, btnStart);

        newBtn.addEventListener('click', () => {
            if (game.audio) game.audio.playClick();
            game.showWorldSelect();
        });
    }
}

export function buildStorySequence(game, includeAfter = false) {
    const base = [
        { textKey: 'story_slides.1', imageSrc: './assets/img/thalion_story_1.webp' },
        { textKey: 'story_slides.2', imageSrc: './assets/img/thalion_story_2.webp' },
        { textKey: 'story_slides.3', imageSrc: './assets/img/thalion_story_3.webp' },
        { textKey: 'story_slides.4', imageSrc: './assets/img/thalion_story_4.webp' },
        { textKey: 'story_slides.5', imageSrc: './assets/img/thalion_story_5.webp' },
        { textKey: 'story_slides.6', imageSrc: './assets/img/thalion_story_6.webp' }
    ];

    if (!includeAfter) return base;
    game.preloadDeferredAssets('story_after');

    const extra = [
        { seenKey: 'blocklands_story_guardian_seen', textKey: 'story_guardian_gate_opening', imageSrc: 'assets/img/story_guardian_gate_opening.webp' },
        { seenKey: 'blocklands_story_fire_ignis_seen', textKey: 'story_fire_ignis_aftermath', imageSrc: 'assets/img/story_fire_ignis_aftermath.webp' },
        { seenKey: 'blocklands_story_forest_aracna_seen', textKey: 'story_forest_aracna_aftermath', imageSrc: 'assets/img/story_forest_aracna_aftermath.webp' },
        { seenKey: 'blocklands_story_mountain_golem_seen', textKey: 'story_mountain_golem_aftermath', imageSrc: 'assets/img/story_mountain_golem_aftermath.webp' },
        { seenKey: 'blocklands_story_desert_grok_seen', textKey: 'story_desert_grok_aftermath', imageSrc: 'assets/img/story_desert_grok_aftermath.webp' },
        { seenKey: 'blocklands_story_castle_dark_wizard_seen', textKey: 'story_castle_dark_wizard_aftermath', imageSrc: 'assets/img/story_castle_dark_wizard_aftermath.webp' }
    ];

    const unlocked = extra.filter((s) => localStorage.getItem(s.seenKey) === 'true');
    return base.concat(unlocked);
}

export function renderStorySlide(game) {
    const textEl = document.getElementById('story-text');
    const imgEl = document.getElementById('story-reaction-img');

    if (!textEl || !imgEl) return;

    const sequence = game._storySequence || buildStorySequence(game, false);

    if (game.storyStep < sequence.length) {
        textEl.style.opacity = 0;
        imgEl.style.opacity = 0;

        setTimeout(() => {
            const slide = sequence[game.storyStep];
            textEl.innerText = game.i18n.t(slide.textKey);
            if (slide.imageSrc) imgEl.src = slide.imageSrc;
            requestAnimationFrame(() => {
                textEl.style.opacity = 1;
                imgEl.style.opacity = 1;
            });
        }, 200);
    } else {
        const savedClass = localStorage.getItem('blocklands_player_class');

        if (game._storyReplayMode || savedClass) {
            game.showWorldSelect();
        } else {
            game.showHeroSelection();
        }
    }
}

export function showSingleStory(game, { textKey, imageSrc, onDone }) {
    const textEl = document.getElementById('story-text');
    const imgEl = document.getElementById('story-reaction-img');
    const screen = game.screenStory || document.getElementById('screen-story');
    if (!textKey || !textEl || !imgEl || !screen) return;
    if (imageSrc) game.preloadImage(imageSrc);

    game.showScreen(game.screenStory);
    game.toggleGlobalHeader(false);

    textEl.style.opacity = 0;
    imgEl.style.opacity = 0;
    imgEl.style.display = 'none';
    if (imageSrc) {
        screen.style.backgroundImage = `url('${imageSrc}')`;
        screen.style.backgroundSize = 'cover';
        screen.style.backgroundPosition = 'center';
    }

    setTimeout(() => {
        textEl.innerText = game.i18n.t(textKey);
        requestAnimationFrame(() => {
            textEl.style.opacity = 1;
        });
    }, 200);

    const bindStoryExit = (id) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.onclick = () => {
            if (game.audio) game.audio.playClick();
            if (typeof onDone === 'function') onDone();
        };
    };

    bindStoryExit('btn-next-slide');
    bindStoryExit('btn-skip-story');
}

export function showHeroSelection(game) {
    game.showScreen(game.screenHeroSelect);
    game.toggleGlobalHeader(false);
}

export function selectHero(game, heroId) {
    if (game.audio) {
        game.audio.playClick();
        if (heroId === 'warrior') game.audio.playSword();
        if (heroId === 'mage') game.audio.playMage();
    }

    game.playerClass = heroId;
    localStorage.setItem('blocklands_player_class', heroId);

    const card = document.getElementById(`card-${heroId}`);
    if (card) {
        card.style.transform = 'scale(1.05)';
        card.style.borderColor = '#fbbf24';
        card.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.4)';
    }

    setTimeout(() => {
        game.runHeroTransition(heroId);
    }, 800);
}

export function runHeroTransition(game, heroId) {
    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('loading-bar-fill');
    const text = document.getElementById('loading-text');

    if (!screen || !bar) return;

    screen.classList.remove('fade-out');
    screen.style.display = 'flex';
    screen.style.opacity = '1';
    bar.style.width = '0%';

    const msg1 = (heroId === 'warrior') ? game.i18n.t('hero_loading.warrior_1') : game.i18n.t('hero_loading.mage_1');
    const msg2 = (heroId === 'warrior') ? game.i18n.t('hero_loading.warrior_2') : game.i18n.t('hero_loading.mage_2');
    const msgFinal = game.i18n.t('hero_loading.common');

    if (text) text.innerText = msg1;

    let progress = 0;
    const duration = 2500;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const interval = setInterval(() => {
        progress += increment;

        if (progress > 70 && progress < 80) progress -= (increment * 0.5);

        bar.style.width = Math.min(progress, 100) + '%';

        if (progress > 40 && progress < 80 && text) text.innerText = msg2;
        if (progress >= 80 && text) text.innerText = msgFinal;

        if (progress >= 100) {
            clearInterval(interval);
            bar.style.width = '100%';

            setTimeout(() => {
                const tutorialWorld = WORLDS.find((w) => w.id === 'tutorial_world');
                if (tutorialWorld) {
                    game.showCampfireScene();
                }

                screen.classList.add('fade-out');
                setTimeout(() => {
                    screen.style.display = 'none';
                }, 800);
            }, 500);
        }
    }, intervalTime);
}

export function checkAdventureIntro(game) {
    const savedClass = localStorage.getItem('blocklands_player_class');
    const hasSeen = localStorage.getItem('blocklands_intro_seen');

    if (savedClass) {
        game.showWorldSelect();
    } else if (hasSeen === 'true') {
        game.showHeroSelection();
    } else {
        game.playStory();
    }
}

export function playStory(game, options = {}) {
    const includeAfter = !!options.includeAfter;
    game._storyReplayMode = includeAfter;
    game._storySequence = game.buildStorySequence(includeAfter);

    game.showScreen(game.screenStory);
    game.toggleGlobalHeader(false);
    game.storyStep = 0;
    game.renderStorySlide();

    const screen = game.screenStory;
    if (screen) {
        screen.style.backgroundImage = "url('./assets/img/bg_story.webp')";
        screen.style.backgroundSize = 'cover';
        screen.style.backgroundPosition = 'center';
    }

    const imgEl = document.getElementById('story-reaction-img');
    if (imgEl) imgEl.style.display = '';

    const btnNext = document.getElementById('btn-next-slide');
    if (btnNext) {
        const newNext = btnNext.cloneNode(true);
        btnNext.parentNode.replaceChild(newNext, btnNext);
        newNext.onclick = () => {
            if (game.audio && game.audio.buffers && game.audio.buffers.click) game.audio.playClick();
            game.storyStep++;
            game.renderStorySlide();
        };
    }

    const btnSkip = document.getElementById('btn-skip-story');
    if (btnSkip) {
        const newSkip = btnSkip.cloneNode(true);
        btnSkip.parentNode.replaceChild(newSkip, btnSkip);
        newSkip.onclick = () => {
            if (game.audio && game.audio.buffers && game.audio.buffers.click) game.audio.playClick();
            if (game._storyReplayMode) game.showWorldSelect();
            else game.showHeroSelection();
        };
    }
}
