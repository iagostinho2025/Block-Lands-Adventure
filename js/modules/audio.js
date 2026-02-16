export class AudioSystem {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // SFX channel
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.ctx.destination);

        // BGM channel
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = 0.3;
        this.bgmGain.connect(this.ctx.destination);

        this.bgmNode = null;
        this.currentMusicKey = null;
        this.buffers = {};
        this.pendingLoads = new Map();
        this.unlocked = false;

        this.soundFiles = {
            drag: 'assets/sounds/drag.mp3',
            drop: 'assets/sounds/drop.mp3',
            click: 'assets/sounds/click.mp3',
            back: 'assets/sounds/back.mp3',
            clear1: 'assets/sounds/clear_1.mp3',
            clear2: 'assets/sounds/clear_2.mp3',
            clear3: 'assets/sounds/clear_3.mp3',
            clear4: 'assets/sounds/clear_4.mp3',
            wow: 'assets/sounds/voice_wow.mp3',
            holycow: 'assets/sounds/voice_holycow.mp3',
            unreal: 'assets/sounds/voice_unreal.mp3',
            mission_complete: 'assets/sounds/mission_complete.mp3',
            boss_hit_1: 'assets/sounds/boss_hit_1.mp3',
            boss_hit_2: 'assets/sounds/boss_hit_2.mp3',
            boss_hit_3: 'assets/sounds/boss_hit_3.mp3',
            boss_hit_4: 'assets/sounds/boss_hit_4.mp3',
            arrow: 'assets/sounds/sound_arrow.mp3',
            wolf: 'assets/sounds/sound_wolf.mp3',
            sword: 'assets/sounds/sound_sword.mp3',
            mage: 'assets/sounds/sound_mage.mp3',
            bgm_fire_10: 'assets/sounds/fire_elite_1.ogg',
            bgm_fire_15: 'assets/sounds/fire_elite_2.ogg',
            bgm_fire_20: 'assets/sounds/fire_boss.ogg',
            bgm_forest_10: 'assets/sounds/forest_elite_1.ogg',
            bgm_forest_15: 'assets/sounds/forest_elite_2.ogg',
            bgm_forest_20: 'assets/sounds/forest_boss.ogg',
            bgm_mountain_10: 'assets/sounds/mountain_elite_1.ogg',
            bgm_mountain_15: 'assets/sounds/mountain_elite_2.ogg',
            bgm_mountain_20: 'assets/sounds/mountain_boss.ogg',
            bgm_desert_10: 'assets/sounds/desert_elite_1.ogg',
            bgm_desert_15: 'assets/sounds/desert_elite_2.ogg',
            bgm_desert_20: 'assets/sounds/desert_boss.ogg',
            bgm_castle_10: 'assets/sounds/castle_elite_1.ogg',
            bgm_castle_15: 'assets/sounds/castle_elite_2.ogg',
            bgm_castle_20: 'assets/sounds/castle_boss.ogg',
            boss_theme: 'assets/sounds/boss_theme.ogg',
            story_theme: 'assets/sounds/story_theme.ogg'
        };

        this.loadSounds();
    }

    async loadSounds() {
        // Preload only essential SFX; heavy BGM stays lazy.
        const essential = [
            'click', 'back', 'drag', 'drop',
            'clear1', 'clear2', 'clear3', 'clear4',
            'boss_hit_1', 'boss_hit_2', 'boss_hit_3', 'boss_hit_4',
            'arrow', 'wolf', 'sword', 'mage'
        ];

        await Promise.all(essential.map((key) => this.loadSoundByKey(key)));
    }

    async loadSoundByKey(key) {
        if (!key) return null;
        if (this.buffers[key]) return this.buffers[key];
        if (this.pendingLoads.has(key)) return this.pendingLoads.get(key);

        const path = this.soundFiles[key];
        if (!path) return null;

        const promise = fetch(path)
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.arrayBuffer();
            })
            .then((buffer) => this.ctx.decodeAudioData(buffer))
            .then((audioBuffer) => {
                this.buffers[key] = audioBuffer;
                return audioBuffer;
            })
            .catch((error) => {
                console.warn(`Audio not found: ${path}`, error);
                return null;
            })
            .finally(() => {
                this.pendingLoads.delete(key);
            });

        this.pendingLoads.set(key, promise);
        return promise;
    }

    _playBuffer(buffer, gainNode, loop = false) {
        if (!buffer) return null;
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = !!loop;
        source.connect(gainNode);
        source.start(0);
        return source;
    }

    unlock() {
        if (this.unlocked) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().then(() => {
                this.unlocked = true;
                this.playTone(0, 'sine', 0.01);
            });
        } else {
            this.unlocked = true;
        }
    }

    playSound(key, fallbackFn) {
        const buffer = this.buffers[key];
        if (buffer) {
            this._playBuffer(buffer, this.masterGain, false);
            return;
        }

        this.loadSoundByKey(key).then((loaded) => {
            if (loaded) this._playBuffer(loaded, this.masterGain, false);
        });

        if (fallbackFn) {
            setTimeout(() => fallbackFn(), 0);
        }
    }

    playMusic(key, fallbackFn) {
        this.stopMusic();
        this.currentMusicKey = key;

        const playLoaded = (buffer) => {
            if (!buffer || this.currentMusicKey !== key) return;
            this.stopMusic();
            this.currentMusicKey = key;
            this.bgmNode = this._playBuffer(buffer, this.bgmGain, true);
        };

        if (this.buffers[key]) {
            playLoaded(this.buffers[key]);
            return;
        }

        if (fallbackFn) {
            this.bgmNode = fallbackFn();
        }

        this.loadSoundByKey(key).then((loaded) => {
            playLoaded(loaded);
        });
    }

    stopMusic() {
        this.currentMusicKey = null;
        if (this.bgmNode) {
            try { this.bgmNode.stop(); } catch (e) {}
            this.bgmNode = null;
        }
    }

    // Basic UI interactions
    playClick() { this.playSound('click', () => this.playTone(800, 'sine', 0.05)); }
    playBack() { this.playSound('back', () => this.playTone(200, 'triangle', 0.1)); }
    playDrag() { this.playSound('drag', () => this.playTone(600, 'sine', 0.03)); }
    playDrop() { this.playSound('drop', () => this.playTone(150, 'triangle', 0.1)); }

    // Boss music
    playBossMusic() {
        this.playMusic('boss_theme', () => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = 50;
            osc.connect(gain);
            gain.connect(this.bgmGain);
            gain.gain.value = 0.1;
            osc.start();
            return osc;
        });
    }

    // Clears
    playClear(lines) {
        let key = 'clear1';
        if (lines >= 4) key = 'clear4';
        else if (lines === 3) key = 'clear3';
        else if (lines === 2) key = 'clear2';
        this.playSound(key, () => this.playTone(440, 'sine', 0.1));
    }

    // Boss clears
    playBossClear(lines) {
        let key = 'boss_hit_1';

        if (lines >= 4) key = 'boss_hit_4';
        else if (lines === 3) key = 'boss_hit_3';
        else if (lines === 2) key = 'boss_hit_2';

        this.playSound(key, () => {
            if (lines >= 4) {
                this.playNoise(0.5);
            } else if (lines === 3) {
                this.playTone(880, 'sawtooth', 0.3);
            } else if (lines === 2) {
                this.playTone(600, 'triangle', 0.1);
            } else {
                this.playTone(100, 'square', 0.1);
            }
        });
    }

    playVictory() {
        this.playClear(4);
    }

    playMissionComplete() {
        this.playSound('mission_complete', () => this.playTone(880, 'sine', 0.5));
    }

    playArrow() { this.playSound('arrow', () => this.playTone(600, 'sawtooth', 0.1)); }
    playWolf() { this.playSound('wolf', () => this.playTone(150, 'square', 0.3)); }
    playSword() { this.playSound('sword', () => this.playTone(400, 'square', 0.1)); }
    playMage() { this.playSound('mage', () => this.playTone(800, 'sine', 0.4)); }

    // Synth fallback
    playTone(freq, type, duration) {
        if (!this.unlocked && this.ctx.state === 'suspended') return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.masterGain);
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        osc.start(now);
        osc.stop(now + duration);
    }

    playNoise(duration) {
        if (!this.unlocked && this.ctx.state === 'suspended') return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.connect(this.masterGain);
        noise.connect(gain);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        noise.start();
    }

    vibrate(pattern) {
        if (!navigator.vibrate) return;

        const now = performance.now();
        if (!this._lastVibrateTime) this._lastVibrateTime = 0;

        const COOLDOWN = 120;
        if (now - this._lastVibrateTime < COOLDOWN) return;
        this._lastVibrateTime = now;

        if (Array.isArray(pattern)) {
            pattern = pattern.map((v) => Math.min(v, 200));
        } else {
            pattern = Math.min(pattern, 200);
        }

        navigator.vibrate(pattern);
    }
}
