const BLITZ_WORD = 'BLOCK LANDS';
const BLITZ_BASE_SECONDS = 10;

const LETTER_PATTERNS = {
    B: [
        '11110',
        '10001',
        '10001',
        '11110',
        '10001',
        '10001',
        '11110'
    ],
    L: [
        '10000',
        '10000',
        '10000',
        '10000',
        '10000',
        '10000',
        '11111'
    ],
    O: [
        '01110',
        '10001',
        '10001',
        '10001',
        '10001',
        '10001',
        '01110'
    ],
    C: [
        '01111',
        '10000',
        '10000',
        '10000',
        '10000',
        '10000',
        '01111'
    ],
    K: [
        '10001',
        '10010',
        '10100',
        '11000',
        '10100',
        '10010',
        '10001'
    ],
    A: [
        '01110',
        '10001',
        '10001',
        '11111',
        '10001',
        '10001',
        '10001'
    ],
    N: [
        '10001',
        '11001',
        '10101',
        '10011',
        '10001',
        '10001',
        '10001'
    ],
    D: [
        '11110',
        '10001',
        '10001',
        '10001',
        '10001',
        '10001',
        '11110'
    ],
    S: [
        '01111',
        '10000',
        '10000',
        '01110',
        '00001',
        '00001',
        '11110'
    ]
};

export class BlitzModeController {
    constructor(options = {}) {
        this.baseSeconds = options.baseSeconds || BLITZ_BASE_SECONDS;
        this.word = options.word || BLITZ_WORD;
        this.progressSteps = 0;
        this.running = false;
        this.stepsDone = 0;
        this.tickStart = 0;
        this.tickTimer = 0;
        this.uiRaf = 0;
        this.letterEls = [];
        this.pixelEls = [];
        this.bonusSeconds = 0;
        this.currentLimitMs = this.baseSeconds * 1000;
    }

    init(app) {
        this.app = app;
        this.cacheDom();
        this.buildTitle();
        this.bindUI();
    }

    cacheDom() {
        this.hudEl = document.getElementById('blitz-hud');
        this.titleEl = document.getElementById('blitz-title');
        this.timerFillEl = document.getElementById('blitz-timer-fill');
        this.modalEl = document.getElementById('blitz-modal');
        this.btnRestart = document.getElementById('btn-blitz-restart');
        this.btnBack = document.getElementById('btn-blitz-back');
    }

    bindUI() {
        if (this.btnRestart) {
            this.btnRestart.addEventListener('click', () => {
                if (this.app?.audio) this.app.audio.playClick();
                this.hideModal();
                this.startRun();
            });
        }
        if (this.btnBack) {
            this.btnBack.addEventListener('click', () => {
                if (this.app?.audio) this.app.audio.playBack();
                this.hideModal();
                this.exit();
                this.app?.showScreen(this.app.screenMenu);
            });
        }
    }

    enter() {
        this.stepsDone = 0;
        this.updateTitleFill();
        this.setTimerFill(0);
        this.showHud(true);
        this.hideModal();
        this.setResultText('');
    }

    exit() {
        this.stopRun('exit');
        this.hideModal();
        this.showHud(false);
    }

    startRun() {
        this.stopRun('restart');
        this.stepsDone = 0;
        this.bonusSeconds = 0;
        this.currentLimitMs = this.baseSeconds * 1000;
        this.runStart = performance.now();
        this.updateTitleFill();
        this.resetBoard();
        if (this.app) {
            this.app._blitzBlocksDone = 0;
            this.app._blitzBlocksTotal = this.progressSteps || 0;
        }
        this.running = true;
        this.tickStart = performance.now();
        this.scheduleTick();
        this.startUiLoop();
    }

    stopRun(reason = 'stop') {
        this.running = false;
        if (this.tickTimer) {
            clearTimeout(this.tickTimer);
            this.tickTimer = 0;
        }
        if (this.uiRaf) {
            cancelAnimationFrame(this.uiRaf);
            this.uiRaf = 0;
        }
        if (this.app) this.app._blitzXpActive = false;
        if (reason === 'win') {
            this.setResultState('win');
            this.showModal();
        } else if (reason === 'fail') {
            this.setResultState('fail');
            this.showModal();
        }
        this.updateResultStats();
    }

    onTimeout() {
        if (!this.running) return;
        this.stopRun('fail');
    }

    updateUI() {
        this.updateTitleFill();
    }

    scheduleTick() {
        if (!this.running) return;
        if (this.tickTimer) clearTimeout(this.tickTimer);
        this.tickTimer = setTimeout(() => this.onTimeout(), this.currentLimitMs);
    }

    startUiLoop() {
        const tick = (now) => {
            if (!this.running) {
                this.uiRaf = 0;
                return;
            }

            const elapsed = Math.min(now - this.tickStart, this.currentLimitMs);
            const pct = this.currentLimitMs > 0 ? (elapsed / this.currentLimitMs) : 0;
            this.setTimerFill(pct);
            this.uiRaf = requestAnimationFrame(tick);
        };
        this.uiRaf = requestAnimationFrame(tick);
    }

    setTimerFill(pct) {
        if (!this.timerFillEl) return;
        const clamped = Math.max(0, Math.min(pct, 1));
        this.timerFillEl.style.width = `${clamped * 100}%`;
    }

    buildTitle() {
        if (!this.titleEl) return;
        this.titleEl.innerHTML = '';
        this.letterEls = [];
        this.pixelEls = [];

        let letterIndex = 0;
        for (const char of this.word) {
            if (char === ' ') {
                const spacer = document.createElement('div');
                spacer.className = 'blitz-letter is-space';
                this.titleEl.appendChild(spacer);
                continue;
            }

            const pattern = LETTER_PATTERNS[char];
            const letterEl = document.createElement('div');
            letterEl.className = 'blitz-letter';
            letterEl.dataset.letterIndex = `${letterIndex}`;
            letterEl.setAttribute('aria-hidden', 'true');

            if (pattern) {
                for (let r = 0; r < pattern.length; r++) {
                    const row = pattern[r];
                    for (let c = 0; c < row.length; c++) {
                        const pixel = document.createElement('div');
                        pixel.className = 'blitz-pixel';
                        if (row[c] === '1') {
                            pixel.classList.add('is-on');
                            this.pixelEls.push(pixel);
                        }
                        letterEl.appendChild(pixel);
                    }
                }
            }

            this.titleEl.appendChild(letterEl);
            this.letterEls.push(letterEl);
            letterIndex += 1;
        }

        this.progressSteps = this.pixelEls.length;
    }

    updateTitleFill() {
        if (!this.pixelEls || this.pixelEls.length === 0) return;
        const max = Math.min(this.stepsDone, this.pixelEls.length);
        for (let i = 0; i < this.pixelEls.length; i++) {
            const lit = i < max;
            this.pixelEls[i].classList.toggle('is-lit', lit);
        }
    }

    showHud(show) {
        if (!this.hudEl) return;
        this.hudEl.setAttribute('aria-hidden', show ? 'false' : 'true');
    }

    showModal() {
        if (!this.modalEl) return;
        this.modalEl.classList.remove('hidden');
        this.modalEl.setAttribute('aria-hidden', 'false');
    }

    hideModal() {
        if (!this.modalEl) return;
        this.modalEl.classList.add('hidden');
        this.modalEl.setAttribute('aria-hidden', 'true');
    }

    setResultText(text) {
        if (!this.modalEl) return;
        const el = this.modalEl.querySelector('#blitz-result-text');
        if (el) el.textContent = text || '';
    }

    setResultState(state) {
        if (!this.modalEl) return;
        const img = this.modalEl.querySelector('#blitz-result-image');
        if (!img) return;

        if (state === 'fail') {
            img.src = 'assets/images/modal_defeat_pt.webp';
            img.alt = 'Tempo Esgotado';
        } else {
            img.src = 'assets/images/modal_victory_pt.webp';
            img.alt = 'Blitz Completo';
        }
    }

    onLinesCleared(linesCleared) {
        if (!this.running) return;
        const count = Math.max(0, Math.floor(linesCleared || 0));
        if (!count) return;

        this.stepsDone = Math.min(this.stepsDone + count, this.progressSteps);
        if (this.app) this.app._blitzBlocksDone = this.stepsDone;
        this.updateTitleFill();

        if (this.stepsDone >= this.progressSteps) {
            this.stopRun('win');
            return;
        }

        this.bonusSeconds += count;
        this.currentLimitMs = (this.baseSeconds + this.bonusSeconds) * 1000;
        this.tickStart = performance.now();
        this.scheduleTick();
        this.setTimerFill(0);
    }

    resetBoard() {
        if (!this.app) return;
        this.app.currentLevelConfig = null;
        this.app.currentGoals = {};
        this.app.collected = {};
        this.app.bossState = this.app.bossState || { active: false, maxHp: 0, currentHp: 0, attackRate: 3, movesWithoutDamage: 0 };
        this.app.bossState.active = false;
        this.app.resetGame();
    }

    updateResultStats() {
        if (!this.app) return;
        const img = document.getElementById('blitz-result-image');
        const timeEl = document.getElementById('blitz-result-time');
        const blocksEl = document.getElementById('blitz-result-blocks');
        const xpEl = document.getElementById('blitz-result-xp');
        const linesEl = document.getElementById('blitz-result-lines');
        const comboEl = document.getElementById('blitz-result-combo');

        const durationMs = this.runStart ? (performance.now() - this.runStart) : 0;
        const format = this.app.formatDuration ? this.app.formatDuration.bind(this.app) : (ms) => {
            const totalSeconds = Math.max(0, Math.floor((ms || 0) / 1000));
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        if (img && this.app.getClassicResultImageSrc) {
            img.src = this.app.getClassicResultImageSrc();
        }
        if (timeEl) timeEl.textContent = format(durationMs);
        if (blocksEl) blocksEl.textContent = `${this.stepsDone}/${this.progressSteps || 0}`;
        if (xpEl) xpEl.textContent = (this.app._blitzMatchXp || 0).toLocaleString();
        if (linesEl) linesEl.textContent = (this.app._blitzLinesCleared || 0).toLocaleString();
        if (comboEl) comboEl.textContent = `${this.app._blitzMaxCombo || 0}`;
    }
}
