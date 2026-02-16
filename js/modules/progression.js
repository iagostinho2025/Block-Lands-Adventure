const STORAGE_KEY = 'blocklands_progression_v1';
const LEVELS_PER_RANK = 10;
const MAX_RANK_INDEX = 9;

export const RANKS = [
    { name: 'Aprendiz', avatar: '🪄', theme: { bg: 'linear-gradient(135deg, #4b5563, #1f2937)', border: '#9ca3af' } },
    { name: 'Escudeiro', avatar: '🛡️', theme: { bg: 'linear-gradient(135deg, #2f4f4f, #1f2937)', border: '#cbd5e1' } },
    { name: 'Aventureiro', avatar: '🧭', theme: { bg: 'linear-gradient(135deg, #166534, #0f172a)', border: '#86efac' } },
    { name: 'Veterano', avatar: '⚔️', theme: { bg: 'linear-gradient(135deg, #7c2d12, #111827)', border: '#f59e0b' } },
    { name: 'Herói', avatar: '🦁', theme: { bg: 'linear-gradient(135deg, #7f1d1d, #111827)', border: '#fca5a5' } },
    { name: 'Campeão', avatar: '🏅', theme: { bg: 'linear-gradient(135deg, #92400e, #111827)', border: '#fde68a' } },
    { name: 'Lendário', avatar: '🌟', theme: { bg: 'linear-gradient(135deg, #6b21a8, #111827)', border: '#e9d5ff' } },
    { name: 'Mestre Arcano', avatar: '🧙‍♂️', theme: { bg: 'linear-gradient(135deg, #0f766e, #111827)', border: '#5eead4' } },
    { name: 'Arqui-Mestre', avatar: '🪶', theme: { bg: 'linear-gradient(135deg, #1d4ed8, #111827)', border: '#bfdbfe' } },
    { name: 'Supremo', avatar: '👑', theme: { bg: 'linear-gradient(135deg, #92400e, #111827)', border: '#facc15' } }
];

const DEFAULT_STATE = {
    xp: 0,
    xpToNext: 100,
    level: 1,
    rankIndex: 0,
    rank: RANKS[0].name,
    totalXp: 0,
    version: 1
};

export function getXpForLevel(level, rankIndex) {
    const base = 100;
    const perLevel = 25;
    const perRank = 150;
    return Math.max(50, Math.floor(base + ((level - 1) * perLevel) + (rankIndex * perRank)));
}

export function getRomanNumeral(value) {
    const map = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    if (value <= 0) return 'I';
    if (value > map.length) return map[map.length - 1];
    return map[value - 1];
}

export function levelUpIfNeeded(state) {
    const next = { ...state };
    if (next.level >= LEVELS_PER_RANK || next.xp < next.xpToNext) {
        return { state: next, didLevelUp: false };
    }

    next.xp -= next.xpToNext;
    next.level = Math.min(next.level + 1, LEVELS_PER_RANK);
    next.xpToNext = getXpForLevel(next.level, next.rankIndex);

    return { state: next, didLevelUp: true };
}

export function rankUpIfNeeded(state) {
    const next = { ...state };
    if (next.rankIndex >= MAX_RANK_INDEX) {
        return { state: next, didRankUp: false };
    }

    if (next.level < LEVELS_PER_RANK || next.xp < next.xpToNext) {
        return { state: next, didRankUp: false };
    }

    next.xp -= next.xpToNext;
    next.rankIndex += 1;
    next.rank = RANKS[next.rankIndex].name;
    next.level = 1;
    next.xpToNext = getXpForLevel(next.level, next.rankIndex);

    return { state: next, didRankUp: true };
}

export function addXP(state, amount) {
    const next = { ...state };
    const delta = Math.max(0, Math.floor(amount || 0));
    if (!delta) {
        return { state: next, levelUps: 0, rankUps: 0 };
    }

    next.xp += delta;
    next.totalXp += delta;

    let levelUps = 0;
    let rankUps = 0;

    while (true) {
        const levelResult = levelUpIfNeeded(next);
        if (levelResult.didLevelUp) {
            Object.assign(next, levelResult.state);
            levelUps += 1;
            continue;
        }

        const rankResult = rankUpIfNeeded(next);
        if (rankResult.didRankUp) {
            Object.assign(next, rankResult.state);
            rankUps += 1;
            continue;
        }

        break;
    }

    return { state: next, levelUps, rankUps };
}

export class PlayerProgression {
    constructor(options = {}) {
        this.storageKey = options.storageKey || STORAGE_KEY;
        this.logger = options.logger || console;
        this.onChange = options.onChange || null;
        this.onLevelUp = options.onLevelUp || null;
        this.onRankUp = options.onRankUp || null;
        this.state = this.load();
        this.applyDerivedFields();
    }

    applyDerivedFields() {
        const rankIndex = Math.min(Math.max(this.state.rankIndex, 0), MAX_RANK_INDEX);
        const level = Math.min(Math.max(this.state.level, 1), LEVELS_PER_RANK);
        this.state.rankIndex = rankIndex;
        this.state.level = level;
        this.state.rank = RANKS[rankIndex].name;
        this.state.xpToNext = getXpForLevel(level, rankIndex);
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...DEFAULT_STATE, ...parsed };
            }
        } catch (err) {
            if (this.logger) {
                this.logger.warn('[PROGRESSION] Falha ao carregar, usando padrÃ£o.', err);
            }
        }
        return { ...DEFAULT_STATE };
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (err) {
            if (this.logger) {
                this.logger.warn('[PROGRESSION] Falha ao salvar.', err);
            }
        }
    }

    addXP(amount, reason = '') {
        const result = addXP(this.state, amount);
        this.state = result.state;
        this.save();

        if (amount > 0 && this.logger) {
            const suffix = reason ? ` (${reason})` : '';
            this.logger.log(`[XP] +${amount}${suffix}`);
        }

        if (result.levelUps && this.onLevelUp) {
            for (let i = 0; i < result.levelUps; i += 1) {
                this.onLevelUp(this.getSnapshot());
            }
        }

        if (result.rankUps && this.onRankUp) {
            for (let i = 0; i < result.rankUps; i += 1) {
                this.onRankUp(this.getSnapshot());
            }
        }

        if (this.onChange) {
            this.onChange(this.getSnapshot());
        }

        return result;
    }

    getSnapshot() {
        return {
            ...this.state,
            rankInfo: RANKS[this.state.rankIndex],
            levelRoman: getRomanNumeral(this.state.level),
            isMaxRank: this.state.rankIndex >= MAX_RANK_INDEX
        };
    }

    canAccessRank(rankName) {
        const targetIndex = RANKS.findIndex(rank => rank.name === rankName);
        if (targetIndex === -1) return false;
        return this.state.rankIndex >= targetIndex;
    }

    canAccessRankIndex(rankIndex) {
        return this.state.rankIndex >= rankIndex;
    }
}
